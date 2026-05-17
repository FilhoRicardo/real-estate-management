import {
  App,
  ItemView,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  WorkspaceLeaf,
} from 'obsidian';
import { parseTask } from './utils/parser.js';

const VIEW_TYPE_REAL_ESTATE = 'real-estate-management-view';

interface RealEstateManagementSettings {
  tasksFolder: string;
  doneFolder: string;
  projectsFolder: string;
  propertiesFolder: string;
  peopleFolder: string;
  clientsFolder: string;
  meetingsFolder: string;
  dailyFolder: string;
}

const DEFAULT_SETTINGS: RealEstateManagementSettings = {
  tasksFolder: 'TaskNotes/Tasks',
  doneFolder: 'TaskNotes/Archive',
  projectsFolder: '7 - Projects',
  propertiesFolder: '4 - Main notes/wiki/properties',
  peopleFolder: '4 - Main notes/wiki/people',
  clientsFolder: '4 - Main notes/wiki/org',
  meetingsFolder: 'Meeting Notes',
  dailyFolder: '1 - Rough notes',
};

interface TaskSummary {
  id: string;
  title: string;
  status: string;
  priority: string;
  due: string | null;
  scheduled: string | null;
  dateCreated: string | null;
  archived: boolean;
}

function normalisePath(path: string) {
  return path.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function isIgnoredFile(file: TFile) {
  const base = file.basename.trim().toLowerCase();
  return base === 'index' || base.startsWith('_') || file.name === 'timetracker.md';
}

function isInFolder(file: TFile, folder: string) {
  const cleaned = normalisePath(folder);
  return cleaned.length > 0 && file.path.startsWith(`${cleaned}/`);
}

export default class RealEstateManagementPlugin extends Plugin {
  settings: RealEstateManagementSettings = { ...DEFAULT_SETTINGS };

  async onload() {
    await this.loadSettings();

    this.registerView(
      VIEW_TYPE_REAL_ESTATE,
      leaf => new RealEstateManagementView(leaf, this),
    );

    this.addRibbonIcon('building-2', 'Real Estate Management', () => {
      this.activateView();
    });

    this.addCommand({
      id: 'open-real-estate-management',
      name: 'Open Real Estate Management',
      callback: () => this.activateView(),
    });

    this.addSettingTab(new RealEstateManagementSettingTab(this.app, this));
  }

  async activateView() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_REAL_ESTATE);
    if (leaves.length) {
      this.app.workspace.revealLeaf(leaves[0]);
      return;
    }

    const leaf = this.app.workspace.getRightLeaf(false);
    await leaf?.setViewState({ type: VIEW_TYPE_REAL_ESTATE, active: true });
    if (leaf) this.app.workspace.revealLeaf(leaf);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.app.workspace.getLeavesOfType(VIEW_TYPE_REAL_ESTATE)
      .forEach(leaf => {
        const view = leaf.view;
        if (view instanceof RealEstateManagementView) view.render();
      });
  }

  async loadTasks(): Promise<TaskSummary[]> {
    const files = this.app.vault.getMarkdownFiles()
      .filter(file => !isIgnoredFile(file))
      .filter(file => isInFolder(file, this.settings.tasksFolder) || isInFolder(file, this.settings.doneFolder));

    const tasks: TaskSummary[] = [];
    for (const file of files) {
      try {
        const text = await this.app.vault.cachedRead(file);
        const parsed = parseTask(file.path, text);
        tasks.push({
          id: file.path,
          title: parsed.title,
          status: parsed.status,
          priority: parsed.priority,
          due: parsed.due,
          scheduled: parsed.scheduled,
          dateCreated: parsed.dateCreated,
          archived: parsed.archived,
        });
      } catch (error) {
        console.warn(`Real Estate Management skipped ${file.path}`, error);
      }
    }

    return tasks.sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999') || a.title.localeCompare(b.title));
  }
}

class RealEstateManagementView extends ItemView {
  plugin: RealEstateManagementPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: RealEstateManagementPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return VIEW_TYPE_REAL_ESTATE;
  }

  getDisplayText() {
    return 'Real Estate Management';
  }

  getIcon() {
    return 'building-2';
  }

  async onOpen() {
    await this.render();
  }

  async render() {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass('rem-plugin-root');

    const header = root.createDiv({ cls: 'rem-header' });
    header.createEl('div', { text: 'Real Estate Management', cls: 'rem-kicker' });
    header.createEl('h2', { text: 'Mission control migration' });

    const actions = header.createDiv({ cls: 'rem-actions' });
    actions.createEl('button', { text: 'Refresh', cls: 'mod-cta' }).addEventListener('click', () => this.render());

    const tasks = await this.plugin.loadTasks();
    const openTasks = tasks.filter(task => !task.archived && task.status !== 'done');
    const doneTasks = tasks.length - openTasks.length;

    const stats = root.createDiv({ cls: 'rem-stats' });
    this.stat(stats, 'Open tasks', String(openTasks.length));
    this.stat(stats, 'Finished tasks', String(doneTasks));
    this.stat(stats, 'Total loaded', String(tasks.length));

    const section = root.createDiv({ cls: 'rem-section' });
    section.createEl('h3', { text: 'Task preview' });

    if (!tasks.length) {
      section.createDiv({
        text: `No tasks found. Check the Tasks folder setting: ${this.plugin.settings.tasksFolder}`,
        cls: 'rem-empty',
      });
      return;
    }

    const list = section.createDiv({ cls: 'rem-task-list' });
    for (const task of openTasks.slice(0, 50)) {
      const row = list.createDiv({ cls: 'rem-task-row' });
      row.createDiv({ text: task.title, cls: 'rem-task-title' });
      const meta = row.createDiv({ cls: 'rem-task-meta' });
      meta.createSpan({ text: task.priority || 'normal' });
      meta.createSpan({ text: task.status || 'none' });
      if (task.due) meta.createSpan({ text: `due ${task.due}` });
      if (task.scheduled) meta.createSpan({ text: `scheduled ${task.scheduled}` });
    }
  }

  stat(parent: HTMLElement, label: string, value: string) {
    const card = parent.createDiv({ cls: 'rem-stat' });
    card.createDiv({ text: label, cls: 'rem-stat-label' });
    card.createDiv({ text: value, cls: 'rem-stat-value' });
  }
}

class RealEstateManagementSettingTab extends PluginSettingTab {
  plugin: RealEstateManagementPlugin;

  constructor(app: App, plugin: RealEstateManagementPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Real Estate Management settings' });
    containerEl.createEl('p', {
      text: 'Set vault-relative folders. This first migration milestone is read-only and lists tasks from your vault.',
    });

    this.folderSetting('Tasks folder', 'Active TaskNotes files.', 'tasksFolder');
    this.folderSetting('Done / archive folder', 'Completed or archived tasks.', 'doneFolder');
    this.folderSetting('Projects folder', 'Project notes.', 'projectsFolder');
    this.folderSetting('Properties folder', 'Property notes.', 'propertiesFolder');
    this.folderSetting('People folder', 'Person notes.', 'peopleFolder');
    this.folderSetting('Clients folder', 'Client or organisation notes.', 'clientsFolder');
    this.folderSetting('Meetings folder', 'Meeting notes.', 'meetingsFolder');
    this.folderSetting('Daily notes folder', 'Daily notes.', 'dailyFolder');
  }

  folderSetting(name: string, desc: string, key: keyof RealEstateManagementSettings) {
    new Setting(this.containerEl)
      .setName(name)
      .setDesc(desc)
      .addText(text => text
        .setPlaceholder(DEFAULT_SETTINGS[key])
        .setValue(this.plugin.settings[key])
        .onChange(async value => {
          this.plugin.settings[key] = normalisePath(value);
          await this.plugin.saveSettings();
          new Notice(`${name} saved`);
        }));
  }
}
