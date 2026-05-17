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

1. Create a minimal Obsidian plugin shell.
2. Port parser and formatter utilities.
3. Build a native view that can list tasks from the vault.
4. Add comments and task close actions.
5. Port properties, people, projects, meetings, and daily notes.
6. Add settings for folder paths.

The existing Vercel web app remains the stable production version until this plugin is useful.
