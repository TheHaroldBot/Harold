const button = require('./button.js');
const selectMenu = require('./selectMenu.js');
const slashCommand = require('./slashCommand.js');
const autoComplete = require('./autocomplete.js');
const { InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		try {
			console.log(`Received type ${interaction.type} interaction: ${interaction.id ?? 'unknown id'}`);
			if (interaction.isButton()) {
				await button.execute(interaction);
			}
			else if (interaction.isSelectMenu()) {
				await selectMenu.execute(interaction);
			}
			else if (interaction.type === InteractionType.ApplicationCommand) {
				await slashCommand.execute(interaction);
			}
			else if (interaction.isMessageContextMenuCommand()) {
				return;
			}
			else if (interaction.isUserContextMenuCommand()) {
				return;
			}
			else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
				await autoComplete.execute(interaction);
			}
			else {
				return;
			}
		}
		catch (error) {
			console.log(`Error running interaction ${interaction.id ?? 'unknown id'}`);
			console.error(error);
		}
	},
};