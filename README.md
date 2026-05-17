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

Recurrence, property comments, richer record editing, meeting-specific workflows, and time tracking have not been migrated yet.

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

1. Add richer record editing for clients, properties, people, projects, and meetings.
2. Add property comments using the same dated-log pattern as tasks.
3. Add recurrent task instance handling.
4. Add meeting-specific start/stop and linked action capture.
5. Port daily-log time tracking.
6. Add safety tools: pre-write conflict checks, restorable backups, and skipped-file diagnostics.
7. Add search and saved filters across every record layer.

## Why Plugin

An Obsidian plugin should reduce friction compared with the web app:

- No browser folder picker.
- Direct vault access.
- Better alignment with Obsidian Sync.
- Native commands, hotkeys, panes, and settings.
- Easier navigation to the underlying Markdown files.

The tradeoff is that the UI needs to be rebuilt around Obsidian's plugin environment.
