# Prune

An Obsidian plugin that prunes your vault so you don't have to. Delete untitled drafts, empty notes, stale files, orphans, and more — manually or on autopilot.

If your vault is full of half-started notes, abandoned drafts, and files you forgot existed, Prune brings it back under control with a single command.

## Features

- **Untitled notes** — Delete notes matching a configurable prefix (e.g. "Untitled", "Untitled 1"). Optionally only if they're empty.
- **Empty notes** — Delete notes with no content.
- **Old notes** — Delete notes not modified in 1, 3, 6, or 12 months.
- **Orphan notes** — Delete notes with no incoming backlinks.
- **Folder cleanup** — Delete old notes from a specific folder, with an optional periodic timer that runs automatically in the background.

## Usage

Open the command palette and run **Prune vault** to clean up your vault based on your enabled rules.

You can also enable **Run on startup** in settings to prune automatically when Obsidian launches.

For folder cleanup, enable **Automatic cleanup** to run on a recurring interval (15 min to 4 hours) without needing to trigger it manually.

## Installation

### From community plugins

Search for "Prune" in **Settings > Community plugins > Browse**.

### Manual

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/shiveenp/obsidian-tidier/releases)
2. Create a folder at `VaultFolder/.obsidian/plugins/obsidian-prune/`
3. Copy both files into that folder
4. Enable the plugin in **Settings > Community plugins**
