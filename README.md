# Real Estate Management Plugin

This is the Obsidian plugin migration of TaskDash.

The existing TaskDash web app remains the stable production app for now. This repo is the native Obsidian plugin version of the same real-estate mission control workflow, built to avoid browser folder permissions and use Obsidian's vault APIs directly.

## Current Milestone

Milestone 1 now establishes the independent plugin core:

- Registers a native Obsidian view.
- Adds a ribbon icon and command.
- Adds settings for vault-relative folders owned by the plugin.
- Creates native records using `remType`.
- Creates/opens today's daily log.
- Shows a dashboard for tasks, clients, properties, people, projects, meetings, and daily logs.
- Reads older TaskNotes-style task files as legacy compatibility records.
- Shows a task detail panel with description and notes.
- Adds task notes through `app.vault.process`.
- Supports due/scheduled edits, postpone one week, and close task.
- Shows detail panels for clients, properties, people, projects, and meetings.
- Shows linked tasks, meetings, projects, people, and properties.
- Adds a daily log panel for Mission, Notes, Reflections, and Brain dump.
- Adds dashboard search across record types and metadata.
- Adds notes to client, property, person, project, and meeting detail panels.
- Adds metadata editing for client, property, person, project, and meeting records.
- Adds recurrent task metadata and a Finish instance action.
- Adds basic daily time clock buttons for Clock in, Break start, Break finish, and Clock out.
- Adds a quick meeting capture panel that creates linked meeting notes from the current task or selected record.
- Adds editable body/description panels for tasks, clients, properties, people, projects, and meetings.
- Creates dated backup copies before modifying existing notes through the plugin.

Advanced time summaries and repair actions have not been migrated yet.

## Development

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

For local Obsidian testing, copy or symlink these files into:

```text
<vault>/.obsidian/plugins/real-estate-management/
```

Required plugin files:

- `manifest.json`
- `main.js`
- `styles.css`

Then enable **Real Estate Management** in Obsidian's Community Plugins settings.

## Native Record Types

New notes created by the plugin use frontmatter like:

```yaml
---
remType: task
title: "Prop - Example - Review lease"
status: open
priority: normal
client: "[[Client Name]]"
property: "[[Property Name]]"
people: []
projects: []
tags:
  - real-estate-management
  - rem-task
---
```

Supported `remType` values:

- `task`
- `client`
- `property`
- `person`
- `project`
- `meeting`
- `daily`

## Suggested Migration Roadmap

1. Add daily time totals and weekly target summaries.
2. Add safety tools: pre-write conflict checks, repair actions, and skipped-file diagnostics.
3. Add saved filters across every record layer.
4. Improve recurrence rules beyond simple day intervals.

## Backup Behavior

Before the plugin edits an existing note, it writes a copy to:

```text
Real Estate Management/Backups/YYYY-MM-DD/
```

The dashboard ignores those backup files so they do not appear as duplicate records.

## Why Plugin

An Obsidian plugin should reduce friction compared with the web app:

- No browser folder picker.
- Direct vault access.
- Better alignment with Obsidian Sync.
- Native commands, hotkeys, panes, and settings.
- Easier navigation to the underlying Markdown files.

The tradeoff is that the UI needs to be rebuilt around Obsidian's plugin environment.
