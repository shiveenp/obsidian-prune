export interface PrunePluginSettings {
	deleteUntitledNotes: boolean;
	untitledPrefix: string;
	onlyIfEmpty: boolean;
	runOnStartup: boolean;
	deleteOldNotes: boolean;
	oldNotesAge: '1' | '3' | '6' | '12';
	protectLinkedNotes: boolean;
	deleteMethod: 'trash' | 'backup';
	deleteFromFolder: boolean;
	targetFolder: string;
	folderCleanupAge: '1' | '3' | '6' | '12';
	deleteEmptyNotes: boolean;
}

export const DEFAULT_SETTINGS: PrunePluginSettings = {
	deleteUntitledNotes: true,
	untitledPrefix: 'Untitled',
	onlyIfEmpty: true,
	runOnStartup: false,
	deleteOldNotes: false,
	oldNotesAge: '12',
	protectLinkedNotes: true,
	deleteMethod: 'trash',
	deleteFromFolder: false,
	targetFolder: '',
	folderCleanupAge: '1',
	deleteEmptyNotes: false,
};
