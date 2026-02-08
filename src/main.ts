import {Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, TidierPluginSettings} from './types';
import {TidierSettingTab} from './settings';
import * as rules from './rules';

export default class TidierPlugin extends Plugin {
	settings: TidierPluginSettings;
	private folderCleanupIntervalId: number | null = null;

	async onload() {
		console.debug('[Tidier] Loading Tidier plugin...');
		await this.loadSettings();

		this.addCommand({
			id: 'tidy-vault',
			name: 'Tidy vault',
			callback: () => this.tidyVault(),
		});

		this.addSettingTab(new TidierSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			if (this.settings.runOnStartup) {
				void this.tidyVault();
			}
			this.setupFolderCleanupTimer();
		});
	}

	async tidyVault() {
		let count = 0;

		if (this.settings.deleteUntitledNotes) {
			count += await rules.deleteUntitledNotes(this.app, this.settings);
		}
		if (this.settings.deleteEmptyNotes) {
			count += await rules.deleteEmptyNotes(this.app);
		}
		if (this.settings.deleteOldNotes) {
			count += await rules.deleteOldNotes(this.app, this.settings);
		}
		if (this.settings.deleteOrphanNotes) {
			count += await rules.deleteOrphanNotes(this.app);
		}
		if (this.settings.deleteFromFolder) {
			count += await rules.deleteFromFolder(this.app, this.settings);
		}

		if (count > 0) {
			new Notice(`Tidier: deleted ${count} note${count === 1 ? '' : 's'}.`);
		} else {
			new Notice('Tidier: vault is already tidy.');
		}
	}

	setupFolderCleanupTimer(): void {
		if (this.folderCleanupIntervalId !== null) {
			window.clearInterval(this.folderCleanupIntervalId);
			this.folderCleanupIntervalId = null;
		}

		if (!this.settings.deleteFromFolder || !this.settings.folderCleanupAutoEnabled || !this.settings.targetFolder) return;

		void rules.deleteFromFolder(this.app, this.settings).then(count => {
			if (count > 0) {
				new Notice(`Tidier: deleted ${count} note${count === 1 ? '' : 's'} from folder.`);
			}
		});

		const intervalMs = parseInt(this.settings.folderCleanupInterval) * 60 * 1000;
		this.folderCleanupIntervalId = this.registerInterval(
			window.setInterval(() => {
				void rules.deleteFromFolder(this.app, this.settings).then(count => {
					if (count > 0) {
						new Notice(`Tidier: deleted ${count} note${count === 1 ? '' : 's'} from folder.`);
					}
				});
			}, intervalMs)
		);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<TidierPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.setupFolderCleanupTimer();
	}
}
