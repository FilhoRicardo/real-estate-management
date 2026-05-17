# Real Estate Management Plugin

This is the Obsidian plugin migration of TaskDash.

The existing TaskDash web app remains the stable production app. This repo is a native Obsidian plugin experiment so the same real-estate mission control workflow can eventually run inside Obsidian without browser folder permissions.

## Current Milestone

Milestone 1 is intentionally small and read-only:

- Registers a native Obsidian view.
- Adds a ribbon icon and command.
- Adds settings for vault-relative folders.
- Reads TaskNotes Markdown files through the Obsidian vault API.
- Lists task counts and a task preview.
- Reuses the existing TaskDash parser utilities.

No task writes, archive actions, property comments, time tracking, or meeting creation have been migrated yet.

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

## Suggested Migration Roadmap

1. Prove read-only task loading in Obsidian.
2. Add conflict-safe task comment writing.
3. Add task close and recurrent instance completion.
4. Port the Today mission control layout.
5. Port properties, people, projects, and meetings.
6. Port daily notes and time tracking.
7. Add safety tools: pre-write conflict checks, restoreable backups, and skipped-file diagnostics.

## Why Plugin

An Obsidian plugin should reduce friction compared with the web app:

- No browser folder picker.
- Direct vault access.
- Better alignment with Obsidian Sync.
- Native commands, hotkeys, panes, and settings.
- Easier navigation to the underlying Markdown files.

The tradeoff is that the UI needs to be rebuilt around Obsidian's plugin environment.
