import {
  App,
  ItemView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TFile,
  WorkspaceLeaf,
} from 'obsidian';
import { parseFrontmatter, parseTask } from './utils/parser.js';

const VIEW_TYPE_REAL_ESTATE = 'real-estate-management-view';
const REM_TAG = 'real-estate-management';

type RecordKind = 'task' | 'client' | 'property' | 'person' | 'project' | 'meeting' | 'daily';

interface RealEstateManagementSettings {
  tasksFolder: string;
  clientsFolder: string;
  propertiesFolder: string;
  peopleFolder: string;
  projectsFolder: string;
  meetingsFolder: string;
  dailyFolder: string;
  doneFolder: string;
}

const DEFAULT_SETTINGS: RealEstateManagementSettings = {
  tasksFolder: 'Real Estate Management/Tasks',
  clientsFolder: 'Real Estate Management/Clients',
  propertiesFolder: 'Real Estate Management/Properties',
  peopleFolder: 'Real Estate Management/People',
  projectsFolder: 'Real Estate Management/Projects',
  meetingsFolder: 'Real Estate Management/Meetings',
  dailyFolder: 'Real Estate Management/Daily Logs',
  doneFolder: 'Real Estate Management/Done',
};

interface RemRecord {
  kind: RecordKind;
  file: TFile;
  title: string;
  status: string;
  priority: string;
  due: string | null;
  scheduled: string | null;
  date: string | null;
  client: string | null;
  property: string | null;
  people: string[];
  projects: string[];
  tasks: string[];
  legacy: boolean;
  description: string;
  notes: { date: string; text: string }[];
  raw: string;
  body: string;
  recurrent: boolean;
  recurrence: string | null;
}

interface RecordDraft {
  kind: RecordKind;
  title: string;
  status: string;
  priority: string;
  due: string;
  scheduled: string;
  client: string;
  property: string;
  people: string;
  projects: string;
  tasks: string;
  body: string;
  recurrent: string;
  recurrence: string;
  contexts: string;
  date: string;
  address: string;
  city: string;
  propertyType: string;
  role: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  startDate: string;
  targetDate: string;
}

interface RecordMetadataDraft {
  title: string;
  status: string;
  date: string;
  client: string;
  property: string;
  people: string;
  projects: string;
  tasks: string;
}

interface MeetingCaptureDraft {
  title: string;
  notes: string;
  startedAt: string;
}

function today() {
  const d = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(date: string, amount: number) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + amount);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function startOfWeek(date: string) {
  const d = new Date(`${date}T12:00:00`);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function weekDates(date: string) {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

function recurrenceDays(rule: string | null) {
  const lower = String(rule || '').toLowerCase();
  if (lower.includes('daily')) return 1;
  if (lower.includes('monthly')) return 30;
  if (lower.includes('quarter')) return 91;
  if (lower.includes('year')) return 365;
  const interval = lower.match(/interval=(\d+)/i)?.[1] || lower.match(/every\s+(\d+)/i)?.[1];
  if (interval) return Number(interval) || 7;
  return 7;
}

function normalisePath(path: string) {
  return path.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function safeFilename(title: string) {
  return title.trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/[. ]+$/g, '')
    .slice(0, 180) || 'Untitled';
}

function isIgnoredFile(file: TFile) {
  const base = file.basename.trim().toLowerCase();
  return base === 'index'
    || base.startsWith('_')
    || file.name === 'timetracker.md'
    || file.path.startsWith('Real Estate Management/Backups/');
}

function isInFolder(file: TFile, folder: string) {
  const cleaned = normalisePath(folder);
  return cleaned.length > 0 && file.path.startsWith(`${cleaned}/`);
}

function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (!value) return [];
  return [String(value)].filter(Boolean);
}

function asLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('[[') && trimmed.endsWith(']]')) return trimmed;
  return `[[${trimmed}]]`;
}

function splitLinks(value: string) {
  return value.split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .map(asLink);
}

function displayLinks(values: string[]) {
  return values
    .map(value => value.replace(/^\[\[/, '').replace(/\]\]$/, ''))
    .join(', ');
}

function uniqueDisplayLinks(values: (string | null | undefined)[]) {
  const seen = new Set<string>();
  return values
    .map(value => String(value || '').replace(/^\[\[/, '').replace(/\]\]$/, '').trim())
    .filter(value => {
      if (!value) return false;
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(', ');
}

function firstString(value: unknown) {
  return Array.isArray(value) ? String(value[0] || '') : String(value || '');
}

function folderForKind(settings: RealEstateManagementSettings, kind: RecordKind) {
  if (kind === 'task') return settings.tasksFolder;
  if (kind === 'client') return settings.clientsFolder;
  if (kind === 'property') return settings.propertiesFolder;
  if (kind === 'person') return settings.peopleFolder;
  if (kind === 'project') return settings.projectsFolder;
  if (kind === 'meeting') return settings.meetingsFolder;
  return settings.dailyFolder;
}

function inferKind(file: TFile, fm: Record<string, unknown>, settings: RealEstateManagementSettings): RecordKind | null {
  const remType = String(fm.remType || '').toLowerCase();
  if (['task', 'client', 'property', 'person', 'project', 'meeting', 'daily'].includes(remType)) return remType as RecordKind;
  if (isInFolder(file, settings.tasksFolder) || isInFolder(file, settings.doneFolder)) return 'task';
  if (isInFolder(file, settings.clientsFolder)) return 'client';
  if (isInFolder(file, settings.propertiesFolder)) return 'property';
  if (isInFolder(file, settings.peopleFolder)) return 'person';
  if (isInFolder(file, settings.projectsFolder)) return 'project';
  if (isInFolder(file, settings.meetingsFolder)) return 'meeting';
  if (isInFolder(file, settings.dailyFolder)) return 'daily';
  return null;
}

function recordTitle(file: TFile, text: string, fm: Record<string, unknown>) {
  const h1 = text.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return firstString(fm.title || fm.name || fm.person || fm.building) || h1 || file.basename;
}

function parseRecord(file: TFile, text: string, settings: RealEstateManagementSettings): RemRecord | null {
  const fm = parseFrontmatter(text) as Record<string, unknown>;
  const kind = inferKind(file, fm, settings);
  if (!kind) return null;

  if (kind === 'task' && !fm.remType) {
    const task = parseTask(file.path, text);
    return {
      kind,
      file,
      title: task.title,
      status: task.status,
      priority: task.priority,
      due: task.due,
      scheduled: task.scheduled,
      date: task.dateCreated,
      client: task.client,
      property: task.building,
      people: task.waitingfor ? [task.waitingfor] : [],
      projects: task.projects || [],
      tasks: [],
      legacy: true,
      description: taskDescriptionText(text),
      notes: task.logs || [],
      raw: text,
      body: taskDescriptionText(text),
      recurrent: task.recurrent,
      recurrence: task.recurrence,
    };
  }

  return {
    kind,
    file,
    title: recordTitle(file, text, fm),
    status: firstString(fm.status) || (kind === 'task' ? 'open' : 'active'),
    priority: firstString(fm.priority) || 'normal',
    due: firstString(fm.due) || null,
    scheduled: firstString(fm.scheduled) || null,
    date: firstString(fm.date || fm.created || fm.dateCreated) || null,
    client: firstString(fm.client) || null,
    property: firstString(fm.property || fm.building) || null,
    people: asArray(fm.people || fm.person),
    projects: asArray(fm.projects || fm.project),
    tasks: asArray(fm.tasks || fm.task),
    legacy: !fm.remType,
    description: kind === 'task' ? taskDescriptionText(text) : '',
    notes: parseDatedLogs(text),
    raw: text,
    body: recordBodyText(text, kind),
    recurrent: firstString(fm.recurrent) === 'true' || asArray(fm.tags).includes('recurrent'),
    recurrence: firstString(fm.recurrence) || null,
  };
}

function sectionBody(text: string, heading: string) {
  const rx = new RegExp(`(^|\\n)##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[ \\t]*(?=\\n|$)`, 'i');
  const match = rx.exec(text);
  if (!match) return '';
  const start = match.index + match[0].length;
  const rest = text.slice(start);
  const nextHeading = rest.search(/\n##\s+/);
  const nextSeparator = rest.search(/\n---[ \t]*(?=\n|$)/);
  const candidates = [nextHeading, nextSeparator].filter(index => index >= 0);
  const end = candidates.length ? Math.min(...candidates) : rest.length;
  return rest.slice(0, end).trim();
}

function taskDescriptionText(text: string) {
  const explicit = sectionBody(text, 'Description');
  if (explicit) return explicit;
  const withoutFrontmatter = text.replace(/^---\n[\s\S]*?\n---\n?/, '');
  return withoutFrontmatter
    .split(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/)[0]
    .replace(/^#\s+.+\n?/, '')
    .replace(/^#{1,6}\s+Task descri(?:p)?tion\s*\n?/i, '')
    .trim();
}

function recordBodyText(text: string, kind: RecordKind) {
  if (kind === 'task') return taskDescriptionText(text);
  const withoutFrontmatter = text.replace(/^---\n[\s\S]*?\n---\n?/, '');
  return withoutFrontmatter
    .replace(/^#\s+.+\n?/, '')
    .split(/\n---[ \t]*(?=\n|$)/)[0]
    .trim();
}

function parseDatedLogs(text: string) {
  const logs: { date: string; text: string }[] = [];
  const rx = /(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2})(?:\]\])?[ \t]*(?=\n|$)/g;
  const headers = [...text.matchAll(rx)].map(match => ({
    date: match[2],
    start: match.index + match[1].length,
    end: match.index + match[0].length,
  }));

  headers.forEach((header, index) => {
    const section = text.slice(header.end, headers[index + 1]?.start ?? text.length);
    [...section.matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)]
      .forEach(match => {
        const body = match[1].trim();
        if (body) logs.push({ date: header.date, text: body });
      });
  });

  return logs.sort((a, b) => a.date.localeCompare(b.date));
}

function timeLabel(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function parseTimeMinutes(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function formatMinutes(minutes: number) {
  const clean = Math.max(0, Math.round(minutes));
  const hours = Math.floor(clean / 60);
  const mins = clean % 60;
  return `${hours}h ${String(mins).padStart(2, '0')}m`;
}

function timeClockEvents(text: string) {
  return [...sectionBody(text, 'Time Clock').matchAll(/\|\s*(\d{1,2}:\d{2})\s*\|\s*([^|]+?)\s*\|/g)]
    .map(match => ({
      minute: parseTimeMinutes(match[1]),
      label: match[2].trim().toLowerCase(),
      rawLabel: match[2].trim(),
    }))
    .filter((event): event is { minute: number; label: string; rawLabel: string } => event.minute !== null)
    .sort((a, b) => a.minute - b.minute);
}

function timeClockSummary(text: string, date: string) {
  let workStart: number | null = null;
  let breakStart: number | null = null;
  let total = 0;
  let breaks = 0;
  const events = timeClockEvents(text);

  for (const event of events) {
    if (event.label.includes('clock in')) {
      workStart = event.minute;
      breakStart = null;
    } else if (event.label.includes('break start')) {
      if (workStart !== null) total += Math.max(0, event.minute - workStart);
      workStart = null;
      breakStart = event.minute;
    } else if (event.label.includes('break finish')) {
      if (breakStart !== null) breaks += Math.max(0, event.minute - breakStart);
      breakStart = null;
      workStart = event.minute;
    } else if (event.label.includes('clock out')) {
      if (workStart !== null) total += Math.max(0, event.minute - workStart);
      if (breakStart !== null) breaks += Math.max(0, event.minute - breakStart);
      workStart = null;
      breakStart = null;
    }
  }

  if (date === today()) {
    const now = parseTimeMinutes(timeLabel()) || 0;
    if (workStart !== null) total += Math.max(0, now - workStart);
    if (breakStart !== null) breaks += Math.max(0, now - breakStart);
  }

  return {
    total,
    breaks,
    events,
    lastEvent: events[events.length - 1]?.rawLabel || '',
    isOpen: workStart !== null || breakStart !== null,
  };
}

function isWeekday(date: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return day >= 1 && day <= 5;
}

function appendDatedLog(text: string, note: string) {
  const date = today();
  const line = `Log: [${timeLabel()}] ${note.trim()}`;
  const header = `### [[${date}]]`;
  const existingHeader = new RegExp(`(^|\\n)### (?:\\[\\[)?${date}(?:\\]\\])?[ \\t]*(?=\\n|$)`).exec(text);

  if (existingHeader) {
    const start = existingHeader.index + existingHeader[0].length;
    const rest = text.slice(start);
    const nextHeader = rest.search(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/);
    const sectionEnd = nextHeader === -1 ? text.length : start + nextHeader;
    const section = text.slice(start, sectionEnd);
    const separator = section.search(/\n---[ \t]*(?=\n|$)/);
    if (separator !== -1) {
      const insertAt = start + separator;
      return `${text.slice(0, insertAt).trimEnd()}\n${line}\n\n${text.slice(insertAt).replace(/^\n+/, '')}`;
    }
    return `${text.slice(0, sectionEnd).trimEnd()}\n${line}\n\n---\n${text.slice(sectionEnd).replace(/^\n+/, '')}`;
  }

  const block = `\n\n${header}\n${line}\n\n---\n`;
  const notesHeading = /(^|\n)##\s+Notes[ \t]*(?=\n|$)/i.exec(text);
  if (notesHeading) {
    const start = notesHeading.index + notesHeading[0].length;
    return `${text.slice(0, start).trimEnd()}${block}${text.slice(start).replace(/^\n+/, '')}`;
  }
  return `${text.trimEnd()}\n\n## Notes${block}`;
}

function appendSectionBullet(text: string, heading: string, value: string) {
  const clean = value.trim();
  if (!clean) return text;
  const rx = new RegExp(`(^|\\n)##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[ \\t]*(?=\\n|$)`, 'i');
  const match = rx.exec(text);
  const bullet = `- ${clean}`;
  if (!match) return `${text.trimEnd()}\n\n## ${heading}\n\n${bullet}\n`;
  const start = match.index + match[0].length;
  const rest = text.slice(start);
  const nextHeading = rest.search(/\n##\s+/);
  const sectionEnd = nextHeading === -1 ? text.length : start + nextHeading;
  return `${text.slice(0, sectionEnd).trimEnd()}\n${bullet}\n${text.slice(sectionEnd)}`;
}

function appendTimeClockEvent(text: string, event: string) {
  const row = `| ${timeLabel()} | ${event} |`;
  const heading = /(^|\n)##\s+Time Clock[ \t]*(?=\n|$)/i.exec(text);
  if (!heading) {
    return `${text.trimEnd()}\n\n## Time Clock\n\n| Time | Event |\n| --- | --- |\n${row}\n\n---\n`;
  }

  const start = heading.index + heading[0].length;
  const rest = text.slice(start);
  const nextHeading = rest.search(/\n##\s+/);
  const sectionEnd = nextHeading === -1 ? text.length : start + nextHeading;
  const section = text.slice(start, sectionEnd);

  if (!/\|\s*Time\s*\|\s*Event\s*\|/i.test(section)) {
    return `${text.slice(0, start).trimEnd()}\n\n| Time | Event |\n| --- | --- |\n${row}\n\n---\n${text.slice(sectionEnd).replace(/^\n+/, '')}`;
  }

  const separator = section.search(/\n---[ \t]*(?=\n|$)/);
  if (separator !== -1) {
    const insertAt = start + separator;
    return `${text.slice(0, insertAt).trimEnd()}\n${row}\n\n${text.slice(insertAt).replace(/^\n+/, '')}`;
  }
  return `${text.slice(0, sectionEnd).trimEnd()}\n${row}\n\n---\n${text.slice(sectionEnd).replace(/^\n+/, '')}`;
}

function ensureFrontmatter(text: string) {
  return /^---\n[\s\S]*?\n---/.test(text) ? text : `---\n---\n\n${text.trimStart()}`;
}

function setFrontmatterScalar(text: string, key: string, value: string) {
  const withFm = ensureFrontmatter(text);
  const match = withFm.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return withFm;
  const body = match[1];
  const nextLine = `${key}: ${value}`;
  const rx = new RegExp(`^${key}:.*$`, 'm');
  const nextBody = rx.test(body)
    ? body.replace(rx, nextLine)
    : `${body.trimEnd()}\n${nextLine}`;
  return `---\n${nextBody}\n---${withFm.slice(match[0].length)}`;
}

function updateFrontmatterScalars(text: string, fields: Record<string, string>) {
  return Object.entries(fields).reduce((next, [key, value]) => setFrontmatterScalar(next, key, value), text);
}

function replaceSectionBody(text: string, heading: string, body: string) {
  const clean = body.trim();
  const rx = new RegExp(`(^|\\n)##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[ \\t]*(?=\\n|$)`, 'i');
  const match = rx.exec(text);
  if (!match) return null;
  const start = match.index + match[0].length;
  const rest = text.slice(start);
  const next = rest.search(/\n(?:##\s+|---[ \t]*(?=\n|$))/);
  const end = next === -1 ? text.length : start + next;
  return `${text.slice(0, start).trimEnd()}\n\n${clean}\n\n${text.slice(end).replace(/^\n+/, '')}`;
}

function replaceTaskDescription(text: string, body: string) {
  const replaced = replaceSectionBody(text, 'Description', body);
  if (replaced) return updateFrontmatterScalars(replaced, { modified: today(), dateModified: today() });

  const clean = body.trim();
  const heading = /^---\n[\s\S]*?\n---\n?/m.exec(text);
  const bodyStart = heading ? heading.index + heading[0].length : 0;
  const title = /^#\s+.+$/m.exec(text.slice(bodyStart));
  if (title) {
    const insertAt = bodyStart + title.index + title[0].length;
    const next = `${text.slice(0, insertAt).trimEnd()}\n\n## Description\n\n${clean}\n\n---\n${text.slice(insertAt).replace(/^\n+/, '')}`;
    return updateFrontmatterScalars(next, { modified: today(), dateModified: today() });
  }

  const next = `${text.trimEnd()}\n\n## Description\n\n${clean}\n\n---\n`;
  return updateFrontmatterScalars(next, { modified: today(), dateModified: today() });
}

function replaceRecordBody(text: string, kind: RecordKind, body: string) {
  if (kind === 'task') return replaceTaskDescription(text, body);
  if (kind === 'meeting') {
    const notes = replaceSectionBody(text, 'Notes', body);
    if (notes) return updateFrontmatterScalars(notes, { modified: today(), dateModified: today() });
  }

  const clean = body.trim();
  const frontmatter = /^---\n[\s\S]*?\n---\n?/m.exec(text);
  const bodyStart = frontmatter ? frontmatter.index + frontmatter[0].length : 0;
  const title = /^#\s+.+$/m.exec(text.slice(bodyStart));
  const contentStart = title ? bodyStart + title.index + title[0].length : bodyStart;
  const rest = text.slice(contentStart);
  const endMatch = rest.search(/\n(?:---[ \t]*(?=\n|$)|##\s+Notes[ \t]*(?=\n|$))/i);
  const contentEnd = endMatch === -1 ? text.length : contentStart + endMatch;
  const next = `${text.slice(0, contentStart).trimEnd()}\n\n${clean}\n\n${text.slice(contentEnd).replace(/^\n+/, '')}`;
  return updateFrontmatterScalars(next, { modified: today(), dateModified: today() });
}

function linkName(value: string | null | undefined) {
  return String(value || '')
    .replace(/^\[\[/, '')
    .replace(/\]\]$/, '')
    .split('|')[0]
    .trim()
    .toLowerCase();
}

function recordAliases(record: RemRecord) {
  return new Set([
    record.title,
    record.file.basename,
    `[[${record.title}]]`,
    `[[${record.file.basename}]]`,
  ].map(linkName).filter(Boolean));
}

function valuesReference(values: (string | null | undefined)[], aliases: Set<string>) {
  return values.some(value => aliases.has(linkName(value)));
}

function recordReferences(candidate: RemRecord, target: RemRecord) {
  if (candidate.file.path === target.file.path) return false;
  const aliases = recordAliases(target);
  return valuesReference([
    candidate.client,
    candidate.property,
    ...candidate.people,
    ...candidate.projects,
    ...candidate.tasks,
  ], aliases);
}

function folderExists(app: App, folder: string) {
  const clean = normalisePath(folder);
  return !!clean && !!app.vault.getAbstractFileByPath(clean);
}

function buildHealthIssues(app: App, settings: RealEstateManagementSettings, records: RemRecord[]) {
  const issues: { level: 'error' | 'warning' | 'info'; text: string }[] = [];
  const folders: [keyof RealEstateManagementSettings, string][] = [
    ['tasksFolder', 'Tasks folder'],
    ['clientsFolder', 'Clients folder'],
    ['propertiesFolder', 'Properties folder'],
    ['peopleFolder', 'People folder'],
    ['projectsFolder', 'Projects folder'],
    ['meetingsFolder', 'Meetings folder'],
    ['dailyFolder', 'Daily logs folder'],
  ];

  for (const [key, label] of folders) {
    if (!folderExists(app, settings[key])) issues.push({ level: key === 'tasksFolder' ? 'error' : 'warning', text: `${label} does not exist: ${settings[key]}` });
  }

  const duplicateTitles = new Map<string, RemRecord[]>();
  for (const record of records) {
    const key = `${record.kind}:${record.title.trim().toLowerCase()}`;
    duplicateTitles.set(key, [...(duplicateTitles.get(key) || []), record]);
    if (record.kind === 'task' && !record.date) issues.push({ level: 'info', text: `Task has no created/date field: ${record.title}` });
    if (record.kind === 'task' && record.due && !/^\d{4}-\d{2}-\d{2}$/.test(record.due)) issues.push({ level: 'warning', text: `Task has invalid due date: ${record.title}` });
    if (record.kind === 'task' && record.scheduled && !/^\d{4}-\d{2}-\d{2}$/.test(record.scheduled)) issues.push({ level: 'warning', text: `Task has invalid scheduled date: ${record.title}` });
  }

  for (const group of duplicateTitles.values()) {
    if (group.length > 1) issues.push({ level: 'warning', text: `Duplicate ${group[0].kind} title "${group[0].title}" appears ${group.length} times.` });
  }

  return issues;
}

function yamlList(items: string[]) {
  if (!items.length) return '[]';
  return `\n${items.map(item => `  - "${item.replace(/"/g, '\\"')}"`).join('\n')}`;
}

function yamlString(value: string) {
  return `"${value.replace(/"/g, '\\"')}"`;
}

function yamlScalar(value: string) {
  const clean = value.trim();
  return clean ? yamlString(clean) : '';
}

function buildRecordMarkdown(draft: RecordDraft) {
  const title = draft.title.trim();
  const created = today();
  const client = asLink(draft.client);
  const property = asLink(draft.property);
  const people = splitLinks(draft.people);
  const projects = splitLinks(draft.projects);
  const tasks = splitLinks(draft.tasks);
  const body = draft.body.trim();

  if (draft.kind === 'task') {
    return `---\nremType: task\ntitle: ${yamlString(title)}\nstatus: ${draft.status || 'open'}\npriority: ${draft.priority || 'normal'}\ndue: ${draft.due || ''}\nscheduled: ${draft.scheduled || ''}\ncontexts: ${yamlList(splitLinks(draft.contexts || 'Work'))}\nrecurrent: ${draft.recurrent === 'true' ? 'true' : 'false'}\nrecurrence: ${draft.recurrence || ''}\ncreated: ${created}\nmodified: ${created}\nclient: ${client ? yamlString(client) : ''}\nproperty: ${property ? yamlString(property) : ''}\npeople: ${yamlList(people)}\nprojects: ${yamlList(projects)}\ntags:\n  - ${REM_TAG}\n  - rem-task\n---\n\n# ${title}\n\n## Description\n\n${body || ''}\n\n---\n\n## Notes\n\n---\n`;
  }

  if (draft.kind === 'meeting') {
    return `---\nremType: meeting\ntitle: ${yamlString(title)}\ndate: ${draft.date || created}\nclient: ${client ? yamlString(client) : ''}\nproperty: ${property ? yamlString(property) : ''}\npeople: ${yamlList(people)}\nprojects: ${yamlList(projects)}\ntasks: ${yamlList(tasks)}\ntags:\n  - ${REM_TAG}\n  - rem-meeting\n---\n\n# ${title}\n\n## Notes\n\n${body || ''}\n\n## Decisions\n\n-\n\n## Actions\n\n-\n`;
  }

  const tag = `rem-${draft.kind}`;
  const extraFields = [
    draft.kind === 'property' ? `address: ${yamlScalar(draft.address)}` : '',
    draft.kind === 'property' ? `city: ${yamlScalar(draft.city)}` : '',
    draft.kind === 'property' ? `propertyType: ${yamlScalar(draft.propertyType)}` : '',
    draft.kind === 'person' ? `role: ${yamlScalar(draft.role)}` : '',
    draft.kind === 'person' ? `email: ${yamlScalar(draft.email)}` : '',
    draft.kind === 'person' ? `phone: ${yamlScalar(draft.phone)}` : '',
    draft.kind === 'person' ? `company: ${yamlScalar(draft.company)}` : '',
    draft.kind === 'project' ? `projectType: ${yamlScalar(draft.projectType)}` : '',
    draft.kind === 'project' ? `startDate: ${draft.startDate || ''}` : '',
    draft.kind === 'project' ? `targetDate: ${draft.targetDate || ''}` : '',
  ].filter(Boolean).join('\n');
  const linkBlock = `client: ${client ? yamlString(client) : ''}\nproperty: ${property ? yamlString(property) : ''}\npeople: ${yamlList(people)}\nprojects: ${yamlList(projects)}\ntasks: ${yamlList(tasks)}`;
  return `---\nremType: ${draft.kind}\ntitle: ${yamlString(title)}\nstatus: ${draft.status || 'active'}\ncreated: ${created}\nmodified: ${created}\n${extraFields ? `${extraFields}\n` : ''}${linkBlock}\ntags:\n  - ${REM_TAG}\n  - ${tag}\n---\n\n# ${title}\n\n${body || ''}\n\n---\n\n## Notes\n\n---\n`;
}

function buildDailyLogMarkdown(date: string) {
  return `---\nremType: daily\ntitle: ${yamlString(date)}\ndate: ${date}\nworkStatus: workday\ntags:\n  - ${REM_TAG}\n  - rem-daily\n---\n\n# ${date}\n\n## Mission\n\n-\n\n## Notes\n\n-\n\n## Reflections\n\n-\n\n## Brain dump\n\n-\n\n## Time Clock\n\n| Time | Event |\n| --- | --- |\n\n---\n`;
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

    this.addCommand({
      id: 'create-real-estate-task',
      name: 'Create real estate task',
      callback: () => this.openCreateModal('task'),
    });

    this.addCommand({
      id: 'open-todays-real-estate-log',
      name: "Open today's real estate daily log",
      callback: () => this.openDailyLog(),
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

  openCreateModal(kind: RecordKind) {
    new RecordCreateModal(this.app, this, kind).open();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.refreshViews();
  }

  refreshViews() {
    this.app.workspace.getLeavesOfType(VIEW_TYPE_REAL_ESTATE)
      .forEach(leaf => {
        const view = leaf.view;
        if (view instanceof RealEstateManagementView) view.render();
      });
  }

  async ensureFolder(path: string) {
    const clean = normalisePath(path);
    if (!clean) return;
    const parts = clean.split('/');
    let current = '';
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!this.app.vault.getAbstractFileByPath(current)) await this.app.vault.createFolder(current);
    }
  }

  async ensureConfiguredFolders() {
    await Promise.all([
      this.ensureFolder(this.settings.tasksFolder),
      this.ensureFolder(this.settings.doneFolder),
      this.ensureFolder(this.settings.clientsFolder),
      this.ensureFolder(this.settings.propertiesFolder),
      this.ensureFolder(this.settings.peopleFolder),
      this.ensureFolder(this.settings.projectsFolder),
      this.ensureFolder(this.settings.meetingsFolder),
      this.ensureFolder(this.settings.dailyFolder),
    ]);
    new Notice('Real Estate Management folders are ready');
    this.refreshViews();
  }

  openSettingsTab() {
    const setting = (this.app as App & { setting?: { open: () => void; openTabById: (id: string) => void } }).setting;
    setting?.open();
    setting?.openTabById(this.manifest.id);
  }

  async uniquePath(folder: string, filename: string) {
    const cleanFolder = normalisePath(folder);
    const base = filename.replace(/\.md$/i, '');
    let path = `${cleanFolder}/${base}.md`;
    let suffix = 2;
    while (this.app.vault.getAbstractFileByPath(path)) {
      path = `${cleanFolder}/${base} ${suffix++}.md`;
    }
    return path;
  }

  async createRecord(draft: RecordDraft) {
    const folder = folderForKind(this.settings, draft.kind);
    await this.ensureFolder(folder);
    const path = await this.uniquePath(folder, safeFilename(draft.kind === 'project' ? `Project - ${draft.title}` : draft.title));
    const file = await this.app.vault.create(path, buildRecordMarkdown(draft));
    new Notice(`Created ${draft.kind}: ${draft.title}`);
    this.refreshViews();
    await this.app.workspace.getLeaf(false).openFile(file);
  }

  async createMeetingFromContext(draft: MeetingCaptureDraft, task?: RemRecord, record?: RemRecord) {
    const title = draft.title.trim() || `Meeting - ${today()} ${timeLabel().replace(':', '')}`;
    const people = [...(task?.people || []), ...(record?.people || [])];
    const projects = [...(task?.projects || []), ...(record?.projects || [])];
    const tasks = [...(record?.tasks || [])];
    let client = task?.client || record?.client || '';
    let property = task?.property || record?.property || '';

    if (task) tasks.push(task.title);
    if (record?.kind === 'client') client = record.title;
    if (record?.kind === 'property') property = record.title;
    if (record?.kind === 'person') people.push(record.title);
    if (record?.kind === 'project') projects.push(record.title);

    const times = draft.startedAt
      ? `Started: ${draft.startedAt}\nEnded: ${timeLabel()}`
      : `Captured: ${timeLabel()}`;
    const body = [times, draft.notes.trim()].filter(Boolean).join('\n\n');

    await this.createRecord({
      kind: 'meeting',
      title,
      status: 'active',
      priority: 'normal',
      due: '',
      scheduled: '',
      client: uniqueDisplayLinks([client]),
      property: uniqueDisplayLinks([property]),
      people: uniqueDisplayLinks(people),
      projects: uniqueDisplayLinks(projects),
      tasks: uniqueDisplayLinks(tasks),
      body,
      recurrent: 'false',
      recurrence: '',
      contexts: '',
      date: '',
      address: '',
      city: '',
      propertyType: '',
      role: '',
      email: '',
      phone: '',
      company: '',
      projectType: '',
      startDate: '',
      targetDate: '',
    });
  }

  async backupFile(file: TFile, text: string) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folder = `Real Estate Management/Backups/${today()}`;
    await this.ensureFolder(folder);
    const backupName = safeFilename(file.path.replace(/\//g, ' - ').replace(/\.md$/i, ''));
    const path = await this.uniquePath(folder, `${backupName} - ${stamp}`);
    await this.app.vault.create(path, text);
  }

  async protectedProcess(file: TFile, update: (current: string) => string) {
    const current = await this.app.vault.cachedRead(file);
    const next = update(current);
    if (next === current) return;
    await this.backupFile(file, current);
    await this.app.vault.modify(file, next);
  }

  async addTaskNote(file: TFile, note: string) {
    const clean = note.trim();
    if (!clean) return;
    await this.protectedProcess(file, current => appendDatedLog(current, clean));
    new Notice('Task note added');
    this.refreshViews();
  }

  async addRecordNote(file: TFile, note: string) {
    const clean = note.trim();
    if (!clean) return;
    await this.protectedProcess(file, current => appendDatedLog(current, clean));
    new Notice('Record note added');
    this.refreshViews();
  }

  async updateTaskFields(file: TFile, fields: Record<string, string>) {
    await this.protectedProcess(file, current => updateFrontmatterScalars(current, {
      ...fields,
      modified: today(),
      dateModified: today(),
    }));
    new Notice('Task updated');
    this.refreshViews();
  }

  async updateRecordMetadata(record: RemRecord, draft: RecordMetadataDraft) {
    const fields: Record<string, string> = {
      title: yamlString(draft.title.trim() || record.title),
      status: draft.status.trim() || record.status || 'active',
      date: draft.date.trim(),
      modified: today(),
      dateModified: today(),
    };

    if (record.kind !== 'client') fields.client = draft.client.trim() ? yamlString(asLink(draft.client)) : '';
    if (!['client', 'property'].includes(record.kind)) fields.property = draft.property.trim() ? yamlString(asLink(draft.property)) : '';
    fields.people = yamlList(splitLinks(draft.people));
    fields.projects = yamlList(splitLinks(draft.projects));
    if (record.kind === 'meeting') fields.tasks = yamlList(splitLinks(draft.tasks));

    await this.protectedProcess(record.file, current => updateFrontmatterScalars(current, fields));
    new Notice('Record metadata updated');
    this.refreshViews();
  }

  async updateRecordBody(record: RemRecord, body: string) {
    await this.protectedProcess(record.file, current => replaceRecordBody(current, record.kind, body));
    new Notice(record.kind === 'task' ? 'Task description updated' : 'Record body updated');
    this.refreshViews();
  }

  async closeTask(file: TFile) {
    await this.updateTaskFields(file, {
      status: 'done',
      completed: today(),
      completedDate: today(),
    });
  }

  async finishTaskInstance(task: RemRecord) {
    const days = recurrenceDays(task.recurrence);
    const fields: Record<string, string> = {
      lastCompleted: today(),
      status: task.status === 'done' ? 'open' : task.status || 'open',
    };
    if (task.due) fields.due = addDays(task.due, days);
    if (task.scheduled) fields.scheduled = addDays(task.scheduled, days);
    if (!task.due && !task.scheduled) fields.due = addDays(today(), days);
    await this.updateTaskFields(task.file, fields);
    new Notice(`Finished instance; next run moved by ${days} days`);
  }

  async postponeTask(task: RemRecord) {
    const fields: Record<string, string> = {};
    if (task.due) fields.due = addDays(task.due, 7);
    if (task.scheduled) fields.scheduled = addDays(task.scheduled, 7);
    if (!task.due && !task.scheduled) fields.due = addDays(today(), 7);
    await this.updateTaskFields(task.file, fields);
  }

  async openDailyLog(date = today()) {
    await this.ensureFolder(this.settings.dailyFolder);
    const path = `${normalisePath(this.settings.dailyFolder)}/${date}.md`;
    const existing = this.app.vault.getAbstractFileByPath(path);
    const file = existing instanceof TFile
      ? existing
      : await this.app.vault.create(path, buildDailyLogMarkdown(date));
    await this.app.workspace.getLeaf(false).openFile(file);
    this.refreshViews();
  }

  async dailyLogFile(date = today()) {
    await this.ensureFolder(this.settings.dailyFolder);
    const path = `${normalisePath(this.settings.dailyFolder)}/${date}.md`;
    const existing = this.app.vault.getAbstractFileByPath(path);
    return existing instanceof TFile
      ? existing
      : await this.app.vault.create(path, buildDailyLogMarkdown(date));
  }

  async appendDailyEntry(section: string, value: string) {
    const file = await this.dailyLogFile();
    await this.protectedProcess(file, current => appendSectionBullet(current, section, value));
    new Notice(`Added to ${section}`);
    this.refreshViews();
  }

  async addDailyTimeClockEvent(event: string) {
    const file = await this.dailyLogFile();
    await this.protectedProcess(file, current => appendTimeClockEvent(current, event));
    new Notice(`${event} saved`);
    this.refreshViews();
  }

  async loadRecords(): Promise<RemRecord[]> {
    const records: RemRecord[] = [];
    for (const file of this.app.vault.getMarkdownFiles()) {
      if (isIgnoredFile(file)) continue;
      try {
        const text = await this.app.vault.cachedRead(file);
        const record = parseRecord(file, text, this.settings);
        if (record) records.push(record);
      } catch (error) {
        console.warn(`Real Estate Management skipped ${file.path}`, error);
      }
    }
    return records.sort((a, b) => a.title.localeCompare(b.title));
  }
}

class RealEstateManagementView extends ItemView {
  plugin: RealEstateManagementPlugin;
  selectedTaskPath = '';
  selectedRecordPath = '';
  noteDraft = '';
  bodyDrafts: Record<string, string> = {};
  recordNoteDrafts: Record<string, string> = {};
  dailyDrafts: Record<string, string> = {};
  meetingDraft: MeetingCaptureDraft = { title: '', notes: '', startedAt: '' };
  searchQuery = '';

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
    const root = this.containerEl.children[1] as HTMLElement;
    root.empty();
    root.addClass('rem-plugin-root');

    const allRecords = await this.plugin.loadRecords();
    const records = this.filterRecords(allRecords);
    const byKind = (kind: RecordKind) => records.filter(record => record.kind === kind);
    const tasks = byKind('task');
    const openTasks = tasks.filter(task => task.status !== 'done' && !isInFolder(task.file, this.plugin.settings.doneFolder));
    const todayTasks = openTasks.filter(task => task.due === today() || task.scheduled === today());
    const overdueTasks = openTasks.filter(task => !!task.due && task.due < today());
    const dailyRecords = allRecords.filter(record => record.kind === 'daily');
    const daily = dailyRecords.find(record => record.date === today());
    const weekTotal = this.weekTimeTotal(dailyRecords);
    const selectedTask = tasks.find(task => task.file.path === this.selectedTaskPath) || todayTasks[0] || openTasks[0];
    if (selectedTask) this.selectedTaskPath = selectedTask.file.path;
    const selectedRecord = records.find(record => record.file.path === this.selectedRecordPath && record.kind !== 'task');
    const healthIssues = buildHealthIssues(this.app, this.plugin.settings, allRecords);

    const header = root.createDiv({ cls: 'rem-header rem-hero' });
    const titleBlock = header.createDiv();
    titleBlock.createEl('div', { text: 'Real Estate Management', cls: 'rem-kicker' });
    titleBlock.createEl('h2', { text: 'Mission control' });
    titleBlock.createEl('p', {
      text: 'Independent Obsidian records for tasks, clients, properties, people, projects, meetings, and daily logs.',
      cls: 'rem-subtitle',
    });
    const search = titleBlock.createEl('input', {
      cls: 'rem-search',
      attr: {
        placeholder: 'Search tasks, clients, properties, people, projects, meetings...',
        type: 'search',
      },
    });
    search.value = this.searchQuery;
    search.addEventListener('input', () => {
      this.searchQuery = search.value;
      this.render();
    });

    const actions = header.createDiv({ cls: 'rem-actions rem-action-grid' });
    this.action(actions, '+ Task', () => this.plugin.openCreateModal('task'));
    this.action(actions, '+ Client', () => this.plugin.openCreateModal('client'));
    this.action(actions, '+ Property', () => this.plugin.openCreateModal('property'));
    this.action(actions, '+ Person', () => this.plugin.openCreateModal('person'));
    this.action(actions, '+ Project', () => this.plugin.openCreateModal('project'));
    this.action(actions, '+ Meeting', () => this.plugin.openCreateModal('meeting'));
    this.action(actions, daily ? 'Open Daily Log' : 'Create Daily Log', () => this.plugin.openDailyLog());
    this.action(actions, 'Setup folders', () => this.plugin.ensureConfiguredFolders());
    this.action(actions, 'Settings', () => this.plugin.openSettingsTab());
    this.action(actions, 'Refresh', () => this.render());

    const stats = root.createDiv({ cls: 'rem-stats' });
    this.stat(stats, 'Open tasks', String(openTasks.length));
    this.stat(stats, 'Today', String(todayTasks.length));
    this.stat(stats, 'Overdue', String(overdueTasks.length));
    this.stat(stats, 'Clients', String(byKind('client').length));
    this.stat(stats, 'Properties', String(byKind('property').length));
    this.stat(stats, 'People', String(byKind('person').length));
    this.stat(stats, 'Projects', String(byKind('project').length));
    this.stat(stats, 'Meetings', String(byKind('meeting').length));
    this.stat(stats, 'Week hours', `${formatMinutes(weekTotal.total)} / ${formatMinutes(weekTotal.target)}`);
    this.stat(stats, 'Health', healthIssues.length ? String(healthIssues.length) : 'OK');
    if (this.searchQuery.trim()) this.stat(stats, 'Search results', String(records.length));

    this.healthPanel(root, healthIssues);
    if (selectedTask) this.taskDetail(root, selectedTask);
    this.dailyPanel(root, daily, dailyRecords);
    this.meetingCapturePanel(root, selectedRecord ? undefined : selectedTask, selectedRecord);
    if (selectedRecord) this.recordDetail(root, selectedRecord, records);

    const grid = root.createDiv({ cls: 'rem-dashboard-grid' });
    this.taskSection(grid, 'Today', todayTasks, 'No tasks due or scheduled today.');
    this.taskSection(grid, 'Overdue', overdueTasks, 'No overdue tasks.');
    this.recordSection(grid, 'Recent meetings', byKind('meeting').slice(-8).reverse(), 'No meetings yet.');
    this.recordSection(grid, 'Properties', byKind('property').slice(0, 12), 'No properties yet.');
    this.recordSection(grid, 'People', byKind('person').slice(0, 12), 'No people yet.');
    this.recordSection(grid, 'Projects', byKind('project').slice(0, 12), 'No projects yet.');
  }

  action(parent: HTMLElement, label: string, callback: () => void) {
    parent.createEl('button', { text: label }).addEventListener('click', callback);
  }

  filterRecords(records: RemRecord[]) {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return records;
    return records.filter(record => [
      record.kind,
      record.title,
      record.file.basename,
      record.status,
      record.priority,
      record.due,
      record.scheduled,
      record.date,
      record.client,
      record.property,
      ...record.people,
      ...record.projects,
      ...record.tasks,
      record.body,
    ].filter(Boolean).some(value => String(value).toLowerCase().includes(query)));
  }

  stat(parent: HTMLElement, label: string, value: string) {
    const card = parent.createDiv({ cls: 'rem-stat' });
    card.createDiv({ text: label, cls: 'rem-stat-label' });
    card.createDiv({ text: value, cls: 'rem-stat-value' });
  }

  weekTimeTotal(dailyRecords: RemRecord[]) {
    const dates = weekDates(today());
    const byDate = new Map(dailyRecords.map(record => [record.date || record.file.basename, record]));
    const total = dates.reduce((sum, date) => {
      const record = byDate.get(date);
      return sum + (record ? timeClockSummary(record.raw, date).total : 0);
    }, 0);
    const target = dates.filter(isWeekday).length * 435;
    return { total, target };
  }

  healthPanel(parent: HTMLElement, issues: { level: 'error' | 'warning' | 'info'; text: string }[]) {
    if (!issues.length) return;
    const panel = parent.createDiv({ cls: 'rem-health-panel' });
    const header = panel.createDiv({ cls: 'rem-health-header' });
    header.createEl('h3', { text: 'Health checks' });
    const actions = header.createDiv({ cls: 'rem-health-actions' });
    actions.createSpan({ text: `${issues.length} item${issues.length === 1 ? '' : 's'}` });
    actions.createEl('button', { text: 'Create folders' }).addEventListener('click', () => this.plugin.ensureConfiguredFolders());
    actions.createEl('button', { text: 'Settings' }).addEventListener('click', () => this.plugin.openSettingsTab());
    for (const issue of issues.slice(0, 8)) {
      const row = panel.createDiv({ cls: `rem-health-row is-${issue.level}` });
      row.createSpan({ text: issue.level.toUpperCase(), cls: 'rem-health-level' });
      row.createSpan({ text: issue.text });
    }
  }

  taskSection(parent: HTMLElement, title: string, tasks: RemRecord[], empty: string) {
    const section = parent.createDiv({ cls: 'rem-section' });
    section.createEl('h3', { text: title });
    if (!tasks.length) {
      section.createDiv({ text: empty, cls: 'rem-empty' });
      return;
    }
    const list = section.createDiv({ cls: 'rem-task-list' });
    for (const task of tasks.slice(0, 12)) this.recordRow(list, task);
  }

  recordSection(parent: HTMLElement, title: string, records: RemRecord[], empty: string) {
    const section = parent.createDiv({ cls: 'rem-section' });
    section.createEl('h3', { text: title });
    if (!records.length) {
      section.createDiv({ text: empty, cls: 'rem-empty' });
      return;
    }
    const list = section.createDiv({ cls: 'rem-task-list' });
    for (const record of records) this.recordRow(list, record);
  }

  recordRow(parent: HTMLElement, record: RemRecord) {
    const row = parent.createDiv({ cls: 'rem-task-row' });
    if (record.kind === 'task') {
      if (record.file.path === this.selectedTaskPath) row.addClass('is-selected');
      row.addEventListener('click', () => {
        this.selectedTaskPath = record.file.path;
        this.selectedRecordPath = '';
        this.noteDraft = '';
        this.render();
      });
    } else {
      if (record.file.path === this.selectedRecordPath) row.addClass('is-selected');
      row.addEventListener('click', () => {
        this.selectedRecordPath = record.file.path;
        this.render();
      });
    }
    row.createDiv({ text: record.title, cls: 'rem-task-title' });
    const meta = row.createDiv({ cls: 'rem-task-meta' });
    meta.createSpan({ text: record.kind });
    if (record.legacy) meta.createSpan({ text: 'legacy' });
    if (record.priority && record.kind === 'task') meta.createSpan({ text: record.priority });
    if (record.status) meta.createSpan({ text: record.status });
    if (record.due) meta.createSpan({ text: `due ${record.due}` });
    if (record.scheduled) meta.createSpan({ text: `scheduled ${record.scheduled}` });
    if (record.client) meta.createSpan({ text: record.client });
    if (record.property) meta.createSpan({ text: record.property });
  }

  taskDetail(parent: HTMLElement, task: RemRecord) {
    const detail = parent.createDiv({ cls: 'rem-task-detail' });
    const header = detail.createDiv({ cls: 'rem-task-detail-header' });
    const titleBlock = header.createDiv();
    titleBlock.createEl('div', { text: task.legacy ? 'Legacy TaskNotes task' : 'Native real estate task', cls: 'rem-kicker' });
    titleBlock.createEl('h3', { text: task.title });
    const meta = titleBlock.createDiv({ cls: 'rem-task-meta' });
    meta.createSpan({ text: task.status || 'open' });
    meta.createSpan({ text: task.priority || 'normal' });
    if (task.due) meta.createSpan({ text: `due ${task.due}` });
    if (task.scheduled) meta.createSpan({ text: `scheduled ${task.scheduled}` });
    if (task.recurrent) meta.createSpan({ text: task.recurrence ? `recurrent ${task.recurrence}` : 'recurrent' });
    if (task.client) meta.createSpan({ text: task.client });
    if (task.property) meta.createSpan({ text: task.property });

    const controls = detail.createDiv({ cls: 'rem-task-controls' });
    this.dateControl(controls, 'Due', task.due || '', value => this.updateSelectedTask(task, { due: value }));
    this.dateControl(controls, 'Scheduled', task.scheduled || '', value => this.updateSelectedTask(task, { scheduled: value }));
    controls.createEl('button', { text: 'Postpone 1w' }).addEventListener('click', () => this.plugin.postponeTask(task));
    if (task.recurrent) controls.createEl('button', { text: 'Finish instance' }).addEventListener('click', () => this.plugin.finishTaskInstance(task));
    controls.createEl('button', { text: 'Close task' }).addEventListener('click', () => this.plugin.closeTask(task.file));

    const openButton = header.createEl('button', { text: 'Open file' });
    openButton.addEventListener('click', () => this.app.workspace.getLeaf(false).openFile(task.file));

    const body = detail.createDiv({ cls: 'rem-task-detail-grid' });
    const description = body.createDiv({ cls: 'rem-panel' });
    description.createEl('h4', { text: 'Description' });
    this.bodyEditor(description, task, task.description, 'Task description');

    const notes = body.createDiv({ cls: 'rem-panel' });
    notes.createEl('h4', { text: 'Notes' });
    const editor = notes.createDiv({ cls: 'rem-note-editor' });
    const textarea = editor.createEl('textarea', {
      text: this.noteDraft,
      attr: {
        placeholder: 'Add a task note... Enter to save, Shift+Enter for a new line',
      },
    });
    textarea.value = this.noteDraft;
    textarea.addEventListener('input', () => {
      this.noteDraft = textarea.value;
    });
    textarea.addEventListener('keydown', async event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        await this.saveTaskNote(task);
      }
    });
    const save = editor.createEl('button', { text: 'Add' });
    save.addEventListener('click', () => this.saveTaskNote(task));

    if (!task.notes.length) {
      notes.createDiv({ text: 'No notes yet.', cls: 'rem-empty' });
      return;
    }

    const list = notes.createDiv({ cls: 'rem-note-list' });
    for (const note of task.notes.slice().reverse().slice(0, 12)) {
      const card = list.createDiv({ cls: 'rem-note-card' });
      card.createDiv({ text: note.date, cls: 'rem-note-date' });
      card.createDiv({ text: note.text, cls: 'rem-note-text' });
    }
  }

  dailyPanel(parent: HTMLElement, daily: RemRecord | undefined, dailyRecords: RemRecord[]) {
    const panel = parent.createDiv({ cls: 'rem-daily-panel' });
    const header = panel.createDiv({ cls: 'rem-daily-header' });
    const title = header.createDiv();
    title.createEl('div', { text: today(), cls: 'rem-kicker' });
    title.createEl('h3', { text: 'Daily log' });
    const open = header.createEl('button', { text: daily ? 'Open daily log' : 'Create daily log' });
    open.addEventListener('click', () => this.plugin.openDailyLog());

    const sections = [
      ['Mission', sectionBody(daily?.raw || '', 'Mission')],
      ['Notes', sectionBody(daily?.raw || '', 'Notes')],
      ['Reflections', sectionBody(daily?.raw || '', 'Reflections')],
      ['Brain dump', sectionBody(daily?.raw || '', 'Brain dump')],
    ] as const;
    const todaySummary = timeClockSummary(daily?.raw || '', today());
    const weekDatesList = weekDates(today());
    const byDate = new Map(dailyRecords.map(record => [record.date || record.file.basename, record]));
    const weekRows = weekDatesList.map(date => ({
      date,
      minutes: byDate.get(date) ? timeClockSummary(byDate.get(date)?.raw || '', date).total : 0,
      target: isWeekday(date) ? 435 : 0,
    }));
    const weekTotal = weekRows.reduce((sum, row) => sum + row.minutes, 0);
    const weekTarget = weekRows.reduce((sum, row) => sum + row.target, 0);

    const clock = panel.createDiv({ cls: 'rem-time-clock-panel' });
    const clockHeader = clock.createDiv({ cls: 'rem-time-clock-header' });
    const clockTitle = clockHeader.createDiv();
    clockTitle.createEl('h4', { text: 'Time Clock' });
    clockTitle.createDiv({
      text: `Today ${formatMinutes(todaySummary.total)}${todaySummary.breaks ? `, breaks ${formatMinutes(todaySummary.breaks)}` : ''}${todaySummary.isOpen ? ', running' : ''}`,
      cls: 'rem-time-clock-subtitle',
    });
    const clockActions = clockHeader.createDiv({ cls: 'rem-time-clock-actions' });
    for (const event of ['Clock in', 'Break start', 'Break finish', 'Clock out']) {
      clockActions.createEl('button', { text: event }).addEventListener('click', () => this.plugin.addDailyTimeClockEvent(event));
    }

    const summary = clock.createDiv({ cls: 'rem-time-summary' });
    summary.createDiv({ text: `Week ${formatMinutes(weekTotal)} / ${formatMinutes(weekTarget)}`, cls: 'rem-time-summary-total' });
    const bars = summary.createDiv({ cls: 'rem-time-bars' });
    for (const row of weekRows) {
      const day = bars.createDiv({ cls: 'rem-time-day' });
      day.createDiv({ text: row.date.slice(5), cls: 'rem-time-day-label' });
      const track = day.createDiv({ cls: 'rem-time-track' });
      const width = row.target ? Math.min(100, Math.round((row.minutes / row.target) * 100)) : row.minutes ? 100 : 0;
      track.createDiv({ cls: 'rem-time-fill', attr: { style: `width: ${width}%` } });
      day.createDiv({ text: formatMinutes(row.minutes), cls: 'rem-time-day-value' });
    }

    clock.createDiv({
      text: sectionBody(daily?.raw || '', 'Time Clock') || 'No time events yet.',
      cls: daily ? 'rem-description rem-time-clock-body' : 'rem-empty',
    });

    const grid = panel.createDiv({ cls: 'rem-daily-grid' });
    for (const [section, body] of sections) {
      const card = grid.createDiv({ cls: 'rem-panel' });
      card.createEl('h4', { text: section });
      card.createDiv({ text: body || 'Nothing written yet.', cls: body ? 'rem-description rem-daily-body' : 'rem-empty' });
      const editor = card.createDiv({ cls: 'rem-daily-editor' });
      const input = editor.createEl('textarea', {
        attr: {
          placeholder: `Add ${section.toLowerCase()}...`,
        },
      });
      input.value = this.dailyDrafts[section] || '';
      input.addEventListener('input', () => {
        this.dailyDrafts[section] = input.value;
      });
      input.addEventListener('keydown', async event => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          await this.saveDailyEntry(section);
        }
      });
      editor.createEl('button', { text: 'Add' }).addEventListener('click', () => this.saveDailyEntry(section));
    }
  }

  meetingCapturePanel(parent: HTMLElement, task?: RemRecord, record?: RemRecord) {
    const panel = parent.createDiv({ cls: 'rem-meeting-panel' });
    const header = panel.createDiv({ cls: 'rem-meeting-header' });
    const title = header.createDiv();
    title.createEl('div', { text: 'Meeting capture', cls: 'rem-kicker' });
    title.createEl('h3', { text: 'Quick meeting note' });
    const context = record ? `${record.kind}: ${record.title}` : task ? `task: ${task.title}` : 'no selected context';
    header.createDiv({ text: `Links to ${context}`, cls: 'rem-meeting-context' });

    const form = panel.createDiv({ cls: 'rem-meeting-grid' });
    const titleInput = form.createEl('input', {
      attr: {
        placeholder: 'Optional meeting title',
        type: 'text',
      },
    });
    titleInput.value = this.meetingDraft.title;
    titleInput.addEventListener('input', () => {
      this.meetingDraft.title = titleInput.value;
    });

    const notes = form.createEl('textarea', {
      attr: {
        placeholder: 'Meeting notes... Enter saves, Shift+Enter adds a new line',
      },
    });
    notes.value = this.meetingDraft.notes;
    notes.addEventListener('input', () => {
      this.meetingDraft.notes = notes.value;
    });
    notes.addEventListener('keydown', async event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        await this.saveMeetingCapture(task, record);
      }
    });

    const actions = form.createDiv({ cls: 'rem-meeting-actions' });
    actions.createEl('button', { text: this.meetingDraft.startedAt ? `Started ${this.meetingDraft.startedAt}` : 'Start' })
      .addEventListener('click', () => {
        this.meetingDraft.startedAt = timeLabel();
        this.render();
      });
    actions.createEl('button', { text: 'Save meeting' }).addEventListener('click', () => this.saveMeetingCapture(task, record));
    if (this.meetingDraft.startedAt || this.meetingDraft.title || this.meetingDraft.notes) {
      actions.createEl('button', { text: 'Clear' }).addEventListener('click', () => {
        this.meetingDraft = { title: '', notes: '', startedAt: '' };
        this.render();
      });
    }
  }

  async saveMeetingCapture(task?: RemRecord, record?: RemRecord) {
    if (!this.meetingDraft.title.trim() && !this.meetingDraft.notes.trim() && !this.meetingDraft.startedAt) {
      new Notice('Add a meeting title, note, or start time first.');
      return;
    }
    await this.plugin.createMeetingFromContext(this.meetingDraft, task, record);
    this.meetingDraft = { title: '', notes: '', startedAt: '' };
    await this.render();
  }

  async saveDailyEntry(section: string) {
    const value = (this.dailyDrafts[section] || '').trim();
    if (!value) return;
    await this.plugin.appendDailyEntry(section, value);
    this.dailyDrafts[section] = '';
    await this.render();
  }

  async saveTaskNote(task: RemRecord) {
    const note = this.noteDraft.trim();
    if (!note) return;
    await this.plugin.addTaskNote(task.file, note);
    this.noteDraft = '';
    await this.render();
  }

  recordDetail(parent: HTMLElement, record: RemRecord, records: RemRecord[]) {
    const related = records.filter(candidate => recordReferences(candidate, record));
    const relatedTasks = related.filter(item => item.kind === 'task');
    const relatedMeetings = related.filter(item => item.kind === 'meeting');
    const relatedProjects = related.filter(item => item.kind === 'project');
    const relatedPeople = related.filter(item => item.kind === 'person');
    const relatedProperties = related.filter(item => item.kind === 'property');

    const detail = parent.createDiv({ cls: 'rem-record-detail' });
    const header = detail.createDiv({ cls: 'rem-task-detail-header' });
    const titleBlock = header.createDiv();
    titleBlock.createEl('div', { text: record.kind, cls: 'rem-kicker' });
    titleBlock.createEl('h3', { text: record.title });
    const meta = titleBlock.createDiv({ cls: 'rem-task-meta' });
    if (record.status) meta.createSpan({ text: record.status });
    if (record.client) meta.createSpan({ text: record.client });
    if (record.property) meta.createSpan({ text: record.property });
    if (record.date) meta.createSpan({ text: record.date });

    const actions = header.createDiv({ cls: 'rem-detail-actions' });
    const editButton = actions.createEl('button', { text: 'Edit metadata' });
    editButton.addEventListener('click', () => new RecordMetadataModal(this.app, this.plugin, record).open());
    const openButton = actions.createEl('button', { text: 'Open file' });
    openButton.addEventListener('click', () => this.app.workspace.getLeaf(false).openFile(record.file));

    const grid = detail.createDiv({ cls: 'rem-record-detail-grid' });
    const body = grid.createDiv({ cls: 'rem-panel' });
    body.createEl('h4', { text: 'Record' });
    this.bodyEditor(body, record, record.body, `${record.kind} body`);

    const relationships = grid.createDiv({ cls: 'rem-panel' });
    relationships.createEl('h4', { text: 'Linked work' });
    this.relatedGroup(relationships, 'Tasks', relatedTasks);
    this.relatedGroup(relationships, 'Meetings', relatedMeetings);
    this.relatedGroup(relationships, 'Projects', relatedProjects);
    this.relatedGroup(relationships, 'People', relatedPeople);
    this.relatedGroup(relationships, 'Properties', relatedProperties);
    if (!related.length) relationships.createDiv({ text: 'No linked records found yet.', cls: 'rem-empty' });

    const notes = grid.createDiv({ cls: 'rem-panel rem-record-notes-panel' });
    notes.createEl('h4', { text: 'Notes' });
    const editor = notes.createDiv({ cls: 'rem-note-editor' });
    const textarea = editor.createEl('textarea', {
      attr: {
        placeholder: `Add a ${record.kind} note... Enter to save, Shift+Enter for a new line`,
      },
    });
    textarea.value = this.recordNoteDrafts[record.file.path] || '';
    textarea.addEventListener('input', () => {
      this.recordNoteDrafts[record.file.path] = textarea.value;
    });
    textarea.addEventListener('keydown', async event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        await this.saveRecordNote(record);
      }
    });
    editor.createEl('button', { text: 'Add' }).addEventListener('click', () => this.saveRecordNote(record));

    if (!record.notes.length) {
      notes.createDiv({ text: 'No notes yet.', cls: 'rem-empty' });
      return;
    }

    const list = notes.createDiv({ cls: 'rem-note-list' });
    for (const note of record.notes.slice().reverse().slice(0, 12)) {
      const card = list.createDiv({ cls: 'rem-note-card' });
      card.createDiv({ text: note.date, cls: 'rem-note-date' });
      card.createDiv({ text: note.text, cls: 'rem-note-text' });
    }
  }

  relatedGroup(parent: HTMLElement, title: string, records: RemRecord[]) {
    if (!records.length) return;
    const group = parent.createDiv({ cls: 'rem-related-group' });
    group.createEl('h5', { text: `${title} (${records.length})` });
    const list = group.createDiv({ cls: 'rem-related-list' });
    for (const record of records.slice(0, 8)) {
      const row = list.createDiv({ cls: 'rem-related-row' });
      row.createSpan({ text: record.title });
      row.addEventListener('click', () => {
        if (record.kind === 'task') {
          this.selectedTaskPath = record.file.path;
          this.selectedRecordPath = '';
        } else {
          this.selectedRecordPath = record.file.path;
        }
        this.render();
      });
    }
  }

  async saveRecordNote(record: RemRecord) {
    const note = (this.recordNoteDrafts[record.file.path] || '').trim();
    if (!note) return;
    await this.plugin.addRecordNote(record.file, note);
    this.recordNoteDrafts[record.file.path] = '';
    await this.render();
  }

  bodyEditor(parent: HTMLElement, record: RemRecord, currentBody: string, label: string) {
    const draft = this.bodyDrafts[record.file.path] ?? currentBody;
    const preview = parent.createDiv({
      text: currentBody || 'No body yet.',
      cls: currentBody ? 'rem-description rem-body-preview' : 'rem-empty rem-body-preview',
    });
    preview.toggleClass('is-dirty', draft !== currentBody);

    const editor = parent.createDiv({ cls: 'rem-body-editor' });
    const textarea = editor.createEl('textarea', {
      attr: {
        placeholder: `Edit ${label.toLowerCase()}...`,
      },
    });
    textarea.value = draft;
    textarea.addEventListener('input', () => {
      this.bodyDrafts[record.file.path] = textarea.value;
    });

    const actions = editor.createDiv({ cls: 'rem-body-actions' });
    actions.createEl('button', { text: 'Save body' }).addEventListener('click', () => this.saveBody(record));
    actions.createEl('button', { text: 'Reset' }).addEventListener('click', () => {
      delete this.bodyDrafts[record.file.path];
      this.render();
    });
  }

  async saveBody(record: RemRecord) {
    const value = this.bodyDrafts[record.file.path] ?? record.body;
    await this.plugin.updateRecordBody(record, value);
    delete this.bodyDrafts[record.file.path];
    await this.render();
  }

  dateControl(parent: HTMLElement, label: string, value: string, onChange: (value: string) => void) {
    const wrap = parent.createEl('label', { cls: 'rem-date-control' });
    wrap.createSpan({ text: label });
    const input = wrap.createEl('input', { type: 'date' });
    input.value = value;
    input.addEventListener('change', () => onChange(input.value));
  }

  async updateSelectedTask(task: RemRecord, fields: Record<string, string>) {
    await this.plugin.updateTaskFields(task.file, fields);
    await this.render();
  }
}

class RecordCreateModal extends Modal {
  plugin: RealEstateManagementPlugin;
  draft: RecordDraft;

  constructor(app: App, plugin: RealEstateManagementPlugin, kind: RecordKind) {
    super(app);
    this.plugin = plugin;
    this.draft = {
      kind,
      title: '',
      status: kind === 'task' ? 'open' : 'active',
      priority: 'normal',
      due: '',
      scheduled: '',
      client: '',
      property: '',
      people: '',
      projects: '',
      tasks: '',
      body: '',
      recurrent: 'false',
      recurrence: '',
      contexts: 'Work',
      date: '',
      address: '',
      city: '',
      propertyType: '',
      role: '',
      email: '',
      phone: '',
      company: '',
      projectType: '',
      startDate: '',
      targetDate: '',
    };
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('rem-modal');
    contentEl.createEl('h2', { text: this.modalTitle() });
    contentEl.createEl('p', { text: this.modalDescription(), cls: 'rem-modal-help' });

    this.text('Title', this.titleHelp(), 'title');

    if (this.draft.kind === 'task') {
      this.dropdown('Status', 'TaskNotes-style status.', 'status', ['open', 'in-progress', 'waiting', 'done']);
      this.dropdown('Priority', 'TaskNotes-style priority.', 'priority', ['normal', 'high', 'low']);
      this.date('Due', 'Deadline.', 'due');
      this.date('Scheduled', 'Planned work date.', 'scheduled');
      this.text('Contexts', 'Comma-separated contexts, for example Work, Calls, Admin.', 'contexts');
      this.text('Client', 'Optional linked client/org note name.', 'client');
      this.text('Property', 'Optional linked property note name.', 'property');
      this.text('People', 'Comma-separated people names.', 'people');
      this.text('Projects', 'Comma-separated project names.', 'projects');
      this.dropdown('Recurrent', 'Whether this task repeats.', 'recurrent', ['false', 'true']);
      this.text('Recurrence', 'weekly, daily, monthly, quarterly, yearly, or every 14 days.', 'recurrence');
    } else if (this.draft.kind === 'client') {
      this.dropdown('Status', 'Relationship status.', 'status', ['active', 'prospect', 'paused', 'archived']);
      this.text('Company / group', 'Optional trading or group name.', 'company');
      this.text('Email', 'General email address.', 'email');
      this.text('Phone', 'General phone number.', 'phone');
      this.text('People', 'Main contacts for this client, comma-separated.', 'people');
      this.text('Projects', 'Known projects for this client, comma-separated.', 'projects');
    } else if (this.draft.kind === 'property') {
      this.dropdown('Status', 'Property status.', 'status', ['active', 'prospect', 'on-hold', 'archived']);
      this.text('Address', 'Street address or building address.', 'address');
      this.text('City / area', 'City, area, or estate.', 'city');
      this.dropdown('Property type', 'Portfolio classification.', 'propertyType', ['office', 'retail', 'industrial', 'residential', 'mixed-use', 'land', 'other']);
      this.text('Client', 'Owner/client/org note name.', 'client');
      this.text('People', 'People linked to this property, comma-separated.', 'people');
      this.text('Projects', 'Projects linked to this property, comma-separated.', 'projects');
    } else if (this.draft.kind === 'person') {
      this.dropdown('Status', 'Contact status.', 'status', ['active', 'follow-up', 'inactive', 'archived']);
      this.text('Role', 'Role, title, or relationship.', 'role');
      this.text('Company', 'Organisation or employer.', 'company');
      this.text('Email', 'Email address.', 'email');
      this.text('Phone', 'Phone number.', 'phone');
      this.text('Client', 'Optional employer/client/org note name.', 'client');
      this.text('Property', 'Optional property note name.', 'property');
      this.text('Projects', 'Projects linked to this person, comma-separated.', 'projects');
    } else if (this.draft.kind === 'project') {
      this.dropdown('Status', 'Project status.', 'status', ['active', 'planning', 'waiting', 'on-hold', 'done', 'archived']);
      this.text('Project type', 'Module, capex, leasing, research, admin, etc.', 'projectType');
      this.date('Start date', 'Project start date.', 'startDate');
      this.date('Target date', 'Target completion date.', 'targetDate');
      this.text('Client', 'Optional client/org note name.', 'client');
      this.text('Property', 'Optional property note name.', 'property');
      this.text('People', 'Project people, comma-separated.', 'people');
    } else if (this.draft.kind === 'meeting') {
      this.date('Meeting date', 'Meeting date.', 'date');
      this.text('Client', 'Optional client/org note name.', 'client');
      this.text('Property', 'Optional property note name.', 'property');
      this.text('People', 'Meeting attendees, comma-separated.', 'people');
      this.text('Projects', 'Linked projects, comma-separated.', 'projects');
      this.text('Tasks', 'Linked tasks, comma-separated.', 'tasks');
    }

    new Setting(contentEl)
      .setName(this.bodyLabel())
      .addTextArea(text => text
        .setPlaceholder(this.bodyPlaceholder())
        .onChange(value => {
          this.draft.body = value;
        }));

    new Setting(contentEl)
      .addButton(button => button
        .setButtonText('Create')
        .setCta()
        .onClick(async () => {
          if (!this.draft.title.trim()) {
            new Notice('Title is required.');
            return;
          }
          await this.plugin.createRecord(this.draft);
          this.close();
        }));
  }

  text(name: string, desc: string, key: keyof RecordDraft) {
    new Setting(this.contentEl)
      .setName(name)
      .setDesc(desc)
      .addText(text => text
        .setValue(String(this.draft[key] || ''))
        .onChange(value => {
          this.draft[key] = value as never;
        }));
  }

  date(name: string, desc: string, key: keyof RecordDraft) {
    new Setting(this.contentEl)
      .setName(name)
      .setDesc(desc)
      .addText(text => {
        text.inputEl.type = 'date';
        text.setValue(String(this.draft[key] || ''));
        text.onChange(value => {
          this.draft[key] = value as never;
        });
      });
  }

  dropdown(name: string, desc: string, key: keyof RecordDraft, options: string[]) {
    new Setting(this.contentEl)
      .setName(name)
      .setDesc(desc)
      .addDropdown(dropdown => {
        for (const option of options) dropdown.addOption(option, option);
        dropdown.setValue(String(this.draft[key] || options[0]));
        dropdown.onChange(value => {
          this.draft[key] = value as never;
        });
      });
  }

  modalTitle() {
    if (this.draft.kind === 'task') return 'New task';
    if (this.draft.kind === 'client') return 'New client';
    if (this.draft.kind === 'property') return 'New property';
    if (this.draft.kind === 'person') return 'New person';
    if (this.draft.kind === 'project') return 'New project';
    return 'New meeting';
  }

  modalDescription() {
    if (this.draft.kind === 'task') return 'TaskNotes-style intake with status, priority, dates, contexts, links, recurrence, and description.';
    if (this.draft.kind === 'client') return 'Create a client or organisation record.';
    if (this.draft.kind === 'property') return 'Create a property record with client, people, and project links.';
    if (this.draft.kind === 'person') return 'Create a person/contact record linked to clients, properties, or projects.';
    if (this.draft.kind === 'project') return 'Create a project record linked to a client, property, and people.';
    return 'Create meeting notes with links to clients, properties, people, projects, and tasks.';
  }

  titleHelp() {
    if (this.draft.kind === 'task') return 'Example: Prop - 1318 City Quay - Review lease.';
    if (this.draft.kind === 'project') return 'The plugin saves project files as Project - Title.';
    return 'Required.';
  }

  bodyLabel() {
    if (this.draft.kind === 'task') return 'Description';
    if (this.draft.kind === 'meeting') return 'Meeting notes';
    return 'Body';
  }

  bodyPlaceholder() {
    if (this.draft.kind === 'task') return 'Write the task description...';
    if (this.draft.kind === 'property') return 'Address, key details, access notes, risks, or property background...';
    if (this.draft.kind === 'person') return 'Role, contact details, preferences, notes...';
    if (this.draft.kind === 'project') return 'Objective, scope, next steps, risks...';
    if (this.draft.kind === 'meeting') return 'Agenda, notes, decisions, actions...';
    return 'Write the starting body...';
  }
}

class RecordMetadataModal extends Modal {
  plugin: RealEstateManagementPlugin;
  record: RemRecord;
  draft: RecordMetadataDraft;

  constructor(app: App, plugin: RealEstateManagementPlugin, record: RemRecord) {
    super(app);
    this.plugin = plugin;
    this.record = record;
    this.draft = {
      title: record.title,
      status: record.status || 'active',
      date: record.date || '',
      client: record.client ? record.client.replace(/^\[\[/, '').replace(/\]\]$/, '') : '',
      property: record.property ? record.property.replace(/^\[\[/, '').replace(/\]\]$/, '') : '',
      people: displayLinks(record.people),
      projects: displayLinks(record.projects),
      tasks: displayLinks(record.tasks),
    };
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('rem-modal');
    contentEl.createEl('h2', { text: `Edit ${this.record.kind}` });

    this.text('Title', 'Shown in the dashboard and frontmatter.', 'title');
    this.text('Status', 'active, paused, done, archived, etc.', 'status');
    this.text('Date', 'YYYY-MM-DD when useful.', 'date');
    if (this.record.kind !== 'client') this.text('Client', 'Client note name.', 'client');
    if (!['client', 'property'].includes(this.record.kind)) this.text('Property', 'Property note name.', 'property');
    this.text('People', 'Comma-separated people names.', 'people');
    this.text('Projects', 'Comma-separated project names.', 'projects');
    if (this.record.kind === 'meeting') this.text('Tasks', 'Comma-separated task names.', 'tasks');

    new Setting(contentEl)
      .addButton(button => button
        .setButtonText('Save metadata')
        .setCta()
        .onClick(async () => {
          if (!this.draft.title.trim()) {
            new Notice('Title is required.');
            return;
          }
          await this.plugin.updateRecordMetadata(this.record, this.draft);
          this.close();
        }));
  }

  text(name: string, desc: string, key: keyof RecordMetadataDraft) {
    new Setting(this.contentEl)
      .setName(name)
      .setDesc(desc)
      .addText(text => text
        .setValue(this.draft[key])
        .onChange(value => {
          this.draft[key] = value;
        }));
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
      text: 'Set vault-relative folders for independent Real Estate Management records. Existing TaskNotes-style task files can still be read as legacy records.',
    });

    new Setting(containerEl)
      .setName('Create missing folders')
      .setDesc('Creates the configured folders inside this vault. Useful when starting a clean test vault.')
      .addButton(button => button
        .setButtonText('Create folders')
        .setCta()
        .onClick(() => this.plugin.ensureConfiguredFolders()));

    this.folderSetting('Tasks folder', 'Native task records.', 'tasksFolder');
    this.folderSetting('Done folder', 'Optional completed task records.', 'doneFolder');
    this.folderSetting('Clients folder', 'Client or organisation records.', 'clientsFolder');
    this.folderSetting('Properties folder', 'Property records.', 'propertiesFolder');
    this.folderSetting('People folder', 'People and contact records.', 'peopleFolder');
    this.folderSetting('Projects folder', 'Project records.', 'projectsFolder');
    this.folderSetting('Meetings folder', 'Meeting records.', 'meetingsFolder');
    this.folderSetting('Daily logs folder', 'Daily logs and dashboard notes.', 'dailyFolder');
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
        }));
  }
}
