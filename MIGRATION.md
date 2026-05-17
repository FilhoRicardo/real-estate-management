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
5. Add task detail panels with description and notes. Done.
6. Add task notes, due/scheduled edits, postpone, and close actions. Done.
7. Add linked record panels for clients, properties, people, projects, and meetings. Done.
8. Add daily-log Mission, Notes, Reflections, and Brain dump editing. Done.
9. Add notes and metadata editing for non-task records. Done.
10. Add recurrent task metadata and finish-instance handling. Done.
11. Add basic daily time clock buttons. Done.
12. Add meeting-specific workflows, richer body editing, advanced time summaries, and safety tools.

The existing Vercel web app remains the stable production version until this plugin is useful.
