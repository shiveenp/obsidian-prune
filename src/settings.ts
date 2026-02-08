import {App, PluginSettingTab, Setting} from "obsidian";
import PrunePlugin from "./main";
import {PrunePluginSettings} from "./types";

export class PruneSettingTab extends PluginSettingTab {
	plugin: PrunePlugin;

	constructor(app: App, plugin: PrunePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// Startup
		new Setting(containerEl).setName('Startup').setHeading();

		new Setting(containerEl)
			.setName('Run on startup')
			.setDesc('Automatically prune the vault when Obsidian starts.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.runOnStartup)
				.onChange(async (value) => {
					this.plugin.settings.runOnStartup = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Delete method')
			.setDesc('Move pruned notes to trash or to a backup folder for review.')
			.addDropdown(dropdown => dropdown
				.addOptions({'trash': 'Move to trash', 'backup': 'Move to prune-backup folder'})
				.setValue(this.plugin.settings.deleteMethod)
				.onChange(async (value) => {
					this.plugin.settings.deleteMethod = value as PrunePluginSettings['deleteMethod'];
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Protect linked notes')
			.setDesc('Never delete notes that have incoming or outgoing links.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.protectLinkedNotes)
				.onChange(async (value) => {
					this.plugin.settings.protectLinkedNotes = value;
					await this.plugin.saveSettings();
				}));

		// Untitled notes
		new Setting(containerEl).setName('Untitled notes').setHeading();

		new Setting(containerEl)
			.setName('Delete untitled notes')
			.setDesc('Delete notes whose filename starts with the untitled prefix.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.deleteUntitledNotes)
				.onChange(async (value) => {
					this.plugin.settings.deleteUntitledNotes = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Untitled prefix')
			.setDesc('Notes whose filename starts with this prefix will be considered untitled.')
			.addText(text => text
				.setPlaceholder('Untitled')
				.setValue(this.plugin.settings.untitledPrefix)
				.onChange(async (value) => {
					this.plugin.settings.untitledPrefix = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Only if empty')
			.setDesc('Only delete untitled notes that have no content.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.onlyIfEmpty)
				.onChange(async (value) => {
					this.plugin.settings.onlyIfEmpty = value;
					await this.plugin.saveSettings();
				}));

		// Empty notes
		new Setting(containerEl).setName('Empty notes').setHeading();

		new Setting(containerEl)
			.setName('Delete empty notes')
			.setDesc('Delete notes with no content.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.deleteEmptyNotes)
				.onChange(async (value) => {
					this.plugin.settings.deleteEmptyNotes = value;
					await this.plugin.saveSettings();
				}));

		// Old notes
		new Setting(containerEl).setName('Old notes').setHeading();

		new Setting(containerEl)
			.setName('Delete old notes')
			.setDesc('Delete notes that have not been modified within the specified time period.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.deleteOldNotes)
				.onChange(async (value) => {
					this.plugin.settings.deleteOldNotes = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Age threshold')
			.setDesc('Notes older than this will be deleted.')
			.addDropdown(dropdown => dropdown
				.addOptions({'1': '1 month', '3': '3 months', '6': '6 months', '12': '12 months'})
				.setValue(this.plugin.settings.oldNotesAge)
				.onChange(async (value) => {
					this.plugin.settings.oldNotesAge = value as PrunePluginSettings['oldNotesAge'];
					await this.plugin.saveSettings();
				}));

		// Folder cleanup
		new Setting(containerEl).setName('Folder cleanup').setHeading();

		new Setting(containerEl)
			.setName('Delete from folder')
			.setDesc('Delete old notes from a specific folder.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.deleteFromFolder)
				.onChange(async (value) => {
					this.plugin.settings.deleteFromFolder = value;
					await this.plugin.saveSettings();
				}));

		const folderOptions: Record<string, string> = {'': 'Select a folder'};
		for (const folder of this.app.vault.getAllFolders()) {
			folderOptions[folder.path] = folder.path;
		}

		new Setting(containerEl)
			.setName('Target folder')
			.setDesc('Notes in this folder will be deleted.')
			.addDropdown(dropdown => dropdown
				.addOptions(folderOptions)
				.setValue(this.plugin.settings.targetFolder)
				.onChange(async (value) => {
					this.plugin.settings.targetFolder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Age threshold')
			.setDesc('Only delete notes in the folder older than this.')
			.addDropdown(dropdown => dropdown
				.addOptions({'1': '1 month', '3': '3 months', '6': '6 months', '12': '12 months'})
				.setValue(this.plugin.settings.folderCleanupAge)
				.onChange(async (value) => {
					this.plugin.settings.folderCleanupAge = value as PrunePluginSettings['folderCleanupAge'];
					await this.plugin.saveSettings();
				}));

	}
}
