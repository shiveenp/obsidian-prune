export interface TidierPluginSettings {
	deleteUntitledNotes: boolean;
	untitledPrefix: string;
	onlyIfEmpty: boolean;
	runOnStartup: boolean;
	deleteOldNotes: boolean;
	oldNotesAge: '1' | '3' | '6' | '12';
	deleteOrphanNotes: boolean;
	deleteFromFolder: boolean;
	targetFolder: string;
	folderCleanupAge: '1' | '3' | '6' | '12';
	folderCleanupAutoEnabled: boolean;
	folderCleanupInterval: '15' | '30' | '60' | '240';
	deleteEmptyNotes: boolean;
}

export const DEFAULT_SETTINGS: TidierPluginSettings = {
	deleteUntitledNotes: true,
	untitledPrefix: 'Untitled',
	onlyIfEmpty: true,
	runOnStartup: false,
	deleteOldNotes: false,
	oldNotesAge: '12',
	deleteOrphanNotes: false,
	deleteFromFolder: false,
	targetFolder: '',
	folderCleanupAge: '1',
	folderCleanupAutoEnabled: false,
	folderCleanupInterval: '60',
	deleteEmptyNotes: false,
};
