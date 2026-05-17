# Real Estate Management Plugin Migration

This repo is a migration copy of TaskDash toward a native Obsidian plugin.

## Goal

Turn the proven TaskDash workflows into an Obsidian-native plugin:

- Today mission control
- Task comments and task closing
- Properties, people, projects, and meetings
- Daily notes and time tracking
- Safer vault-native file access through Obsidian APIs

## Migration Order

1. Create a minimal Obsidian plugin shell. Done.
2. Define independent `remType` records. Done.
3. Build a dashboard that reads native records and legacy TaskNotes tasks. Done.
4. Add creation for tasks, clients, properties, people, projects, meetings, and daily logs. Done.
5. Add task detail panels with description and notes.
6. Add comments and task close actions.
7. Add richer properties, people, projects, meetings, and daily-log workflows.
8. Add safety tools before heavy write actions.

The existing Vercel web app remains the stable production version until this plugin is useful.
