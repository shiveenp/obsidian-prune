import {Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, PrunePluginSettings} from './types';
import {PruneSettingTab} from './settings';
import * as rules from './rules';

export default class PrunePlugin extends Plugin {
	settings: PrunePluginSettings;

	async onload() {
		console.debug('[Prune] Loading Prune plugin...');
		await this.loadSettings();

		this.addCommand({
			id: 'tidy-vault',
			name: 'Vault',
			callback: () => this.pruneVault(),
		});

		this.addSettingTab(new PruneSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			if (this.settings.runOnStartup) {
				void this.pruneVault();
			}
		});
	}

	async pruneVault() {
		let count = 0;

		if (this.settings.deleteUntitledNotes) {
			count += await rules.deleteUntitledNotes(this.app, this.settings);
		}
		if (this.settings.deleteEmptyNotes) {
			count += await rules.deleteEmptyNotes(this.app, this.settings);
		}
		if (this.settings.deleteOldNotes) {
			count += await rules.deleteOldNotes(this.app, this.settings);
		}
		if (this.settings.deleteFromFolder) {
			count += await rules.deleteFromFolder(this.app, this.settings);
		}

		if (count > 0) {
			new Notice(`Prune: deleted ${count} note${count === 1 ? '' : 's'}.`);
		} else {
			new Notice('Prune: vault is already clean.');
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<PrunePluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
