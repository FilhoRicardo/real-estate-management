# Real Estate Management Plugin

This is the Obsidian plugin migration of TaskDash.

The existing TaskDash web app remains the stable production app. This repo is a native Obsidian plugin experiment so the same real-estate mission control workflow can eventually run inside Obsidian without browser folder permissions.

## Current Milestone

Milestone 1 now establishes the independent plugin core:

- Registers a native Obsidian view.
- Adds a ribbon icon and command.
- Adds settings for vault-relative folders owned by the plugin.
- Creates native records using `remType`.
- Creates/opens today's daily log.
- Shows a dashboard for tasks, clients, properties, people, projects, meetings, and daily logs.
- Reads older TaskNotes-style task files as legacy compatibility records.

Advanced task detail editing, comments, archive actions, recurrence, property comments, and time tracking have not been migrated yet.

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

1. Add a task detail view with description and notes side-by-side.
2. Add conflict-safe task comment writing.
3. Add task close and recurrent instance completion.
4. Add richer client/property/person/project detail panels.
5. Add meeting notes linked to every layer.
6. Port daily-log time tracking.
7. Add safety tools: pre-write conflict checks, restorable backups, and skipped-file diagnostics.

## Why Plugin

An Obsidian plugin should reduce friction compared with the web app:

- No browser folder picker.
- Direct vault access.
- Better alignment with Obsidian Sync.
- Native commands, hotkeys, panes, and settings.
- Easier navigation to the underlying Markdown files.

The tradeoff is that the UI needs to be rebuilt around Obsidian's plugin environment.
