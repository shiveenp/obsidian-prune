import {App, TFile} from 'obsidian';
import {PrunePluginSettings} from './types';

export const BACKUP_FOLDER = 'prune-backup';

export function getLinkedPaths(app: App): Set<string> {
	const linked = new Set<string>();
	const resolvedLinks = app.metadataCache.resolvedLinks;

	for (const sourcePath in resolvedLinks) {
		linked.add(sourcePath);
		const targets = resolvedLinks[sourcePath];
		for (const targetPath in targets) {
			linked.add(targetPath);
		}
	}
	return linked;
}

async function removeFile(app: App, file: TFile, settings: PrunePluginSettings): Promise<void> {
	if (settings.deleteMethod === 'backup') {
		const destPath = `${BACKUP_FOLDER}/${file.path}`;
		const destDir = destPath.substring(0, destPath.lastIndexOf('/'));

		if (!app.vault.getAbstractFileByPath(destDir)) {
			await app.vault.createFolder(destDir);
		}

		await app.vault.rename(file, destPath);
	} else {
		await app.fileManager.trashFile(file);
	}
}

function isInBackupFolder(file: TFile): boolean {
	return file.path.startsWith(BACKUP_FOLDER + '/');
}

export async function deleteUntitledNotes(app: App, settings: PrunePluginSettings, linkedPaths: Set<string> | null = null): Promise<number> {
	const prefix = settings.untitledPrefix;
	if (!prefix) return 0;

	const files = app.vault.getMarkdownFiles();
	const paths = linkedPaths ?? (settings.protectLinkedNotes ? getLinkedPaths(app) : null);
	let deleted = 0;

	for (const file of files) {
		if (isInBackupFolder(file)) continue;
		if (!isUntitled(file, prefix)) continue;
		if (paths && paths.has(file.path)) continue;

		if (settings.onlyIfEmpty) {
			const content = await app.vault.read(file);
			if (content.trim().length > 0) continue;
		}

		await removeFile(app, file, settings);
		deleted++;
	}

	return deleted;
}

export async function deleteEmptyNotes(app: App, settings: PrunePluginSettings, linkedPaths: Set<string> | null = null): Promise<number> {
	const files = app.vault.getMarkdownFiles();
	const paths = linkedPaths ?? (settings.protectLinkedNotes ? getLinkedPaths(app) : null);
	let deleted = 0;

	for (const file of files) {
		if (isInBackupFolder(file)) continue;
		if (paths && paths.has(file.path)) continue;

		const content = await app.vault.read(file);
		if (content.trim().length === 0) {
			await removeFile(app, file, settings);
			deleted++;
		}
	}
	return deleted;
}

export async function deleteOldNotes(app: App, settings: PrunePluginSettings, linkedPaths: Set<string> | null = null): Promise<number> {
	const months = parseInt(settings.oldNotesAge);
	const cutoff = Date.now() - months * 30 * 24 * 60 * 60 * 1000;
	const files = app.vault.getMarkdownFiles();
	const paths = linkedPaths ?? (settings.protectLinkedNotes ? getLinkedPaths(app) : null);
	let deleted = 0;

	for (const file of files) {
		if (isInBackupFolder(file)) continue;
		if (file.stat.mtime >= cutoff) continue;
		if (paths && paths.has(file.path)) continue;

		await removeFile(app, file, settings);
		deleted++;
	}

	return deleted;
}

export async function deleteFromFolder(app: App, settings: PrunePluginSettings, linkedPaths: Set<string> | null = null): Promise<number> {
	const folderPath = settings.targetFolder;
	if (!folderPath) return 0;

	const months = parseInt(settings.folderCleanupAge);
	const cutoff = Date.now() - months * 30 * 24 * 60 * 60 * 1000;
	const files = app.vault.getMarkdownFiles();
	const paths = linkedPaths ?? (settings.protectLinkedNotes ? getLinkedPaths(app) : null);
	let deleted = 0;

	for (const file of files) {
		if (isInBackupFolder(file)) continue;
		if (file.parent?.path !== folderPath) continue;
		if (file.stat.mtime >= cutoff) continue;
		if (paths && paths.has(file.path)) continue;

		await removeFile(app, file, settings);
		deleted++;
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
