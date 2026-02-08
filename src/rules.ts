import {App, TFile} from 'obsidian';
import {TidierPluginSettings} from './types';

export async function deleteUntitledNotes(app: App, settings: TidierPluginSettings): Promise<number> {
	const prefix = settings.untitledPrefix;
	if (!prefix) return 0;

	const files = app.vault.getMarkdownFiles();
	let deleted = 0;

	for (const file of files) {
		if (!isUntitled(file, prefix)) continue;

		if (settings.onlyIfEmpty) {
			const content = await app.vault.read(file);
			if (content.trim().length > 0) continue;
		}

		await app.fileManager.trashFile(file);
		deleted++;
	}

	return deleted;
}

export async function deleteEmptyNotes(app: App): Promise<number> {
	const files = app.vault.getMarkdownFiles();
	let deleted = 0;

	for (const file of files) {
		const content = await app.vault.read(file);
		if (content.trim().length === 0) {
			await app.fileManager.trashFile(file);
			deleted++;
		}
	}

	return deleted;
}

export async function deleteOldNotes(app: App, settings: TidierPluginSettings): Promise<number> {
	const months = parseInt(settings.oldNotesAge);
	const cutoff = Date.now() - months * 30 * 24 * 60 * 60 * 1000;
	const files = app.vault.getMarkdownFiles();
	let deleted = 0;

	for (const file of files) {
		if (file.stat.mtime < cutoff) {
			await app.fileManager.trashFile(file);
			deleted++;
		}
	}

	return deleted;
}

export async function deleteOrphanNotes(app: App): Promise<number> {
	const resolvedLinks = app.metadataCache.resolvedLinks;
	const linkedPaths = new Set<string>();

	for (const sourcePath in resolvedLinks) {
		for (const targetPath in resolvedLinks[sourcePath]) {
			linkedPaths.add(targetPath);
		}
	}

	const files = app.vault.getMarkdownFiles();
	let deleted = 0;

	for (const file of files) {
		if (!linkedPaths.has(file.path)) {
			await app.fileManager.trashFile(file);
			deleted++;
		}
	}

	return deleted;
}

export async function deleteFromFolder(app: App, settings: TidierPluginSettings): Promise<number> {
	const folderPath = settings.targetFolder;
	if (!folderPath) return 0;

	const months = parseInt(settings.folderCleanupAge);
	const cutoff = Date.now() - months * 30 * 24 * 60 * 60 * 1000;
	const files = app.vault.getMarkdownFiles();
	let deleted = 0;

	for (const file of files) {
		if (file.parent?.path === folderPath && file.stat.mtime < cutoff) {
			await app.fileManager.trashFile(file);
			deleted++;
		}
	}

	return deleted;
}

function isUntitled(file: TFile, prefix: string): boolean {
	const name = file.basename;
	if (name === prefix) return true;
	// Match "Untitled", "Untitled 1", "Untitled 2", etc.
	if (name.startsWith(prefix + ' ')) {
		const suffix = name.slice(prefix.length + 1);
		return /^\d+$/.test(suffix);
	}
	return false;
}
