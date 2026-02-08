# Prune

An Obsidian plugin that prunes your vault so you don't have to. Delete untitled drafts, empty notes, stale files, orphans, and more — manually or on autopilot.

I made this plugin because I was tired of seeing random Untitled notes in my vault. If you've ever seen `Untitled 1, 2, 3` etc. in your vault, then you know what i mean. I couldn't find anything that worked exactly as I would like in the plugins marketplace, so I made my own. Eventually, I found some other uses like cleaning old notes or notes from my doodle folder.

If your vault is full of half-started notes, abandoned drafts, and files you forgot existed, Prune brings it back under control with a single command. 

## Features

- **Untitled notes** — Delete notes matching a configurable prefix (e.g. "Untitled", "Untitled 1"). Optionally only if they're empty.
- **Empty notes** — Delete notes with no content.
- **Old notes** — Delete notes not modified in 1, 3, 6, or 12 months.
- **Protected linked notes** — Never delete notes that have incoming or outgoing links.
- **Orphan notes** — Delete notes with no incoming backlinks.
- **Folder cleanup** — Delete old notes from a specific folder.
- **Safety baked in** — <ins>Never</ins> delete notes that have incoming or outgoing links. Provides options to move the delete files in a separate folder for review.


## Usage

Open the command palette and run **Prune vault** to clean up your vault based on your enabled rules.

You can also enable **Run on startup** in settings to prune automatically when Obsidian launches.

## Installation

### From community plugins

Search for "Prune" in **Settings > Community plugins > Browse**.

### Manual

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/shiveenp/obsidian-tidier/releases)
2. Create a folder at `VaultFolder/.obsidian/plugins/obsidian-prune/`
3. Copy both files into that folder
4. Enable the plugin in **Settings > Community plugins**
