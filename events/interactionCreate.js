const button = require('./button.js');
const selectMenu = require('./selectMenu.js');
const slashCommand = require('./slashCommand.js');
const autoComplete = require('./autocomplete.js');

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		try {
			console.log(`Received ${interaction.type} interaction ${interaction.id ?? 'unknown id'}`);
			if (interaction.isButton()) {
				await button.execute(interaction);
			}
			else if (interaction.isSelectMenu()) {
				await selectMenu.execute(interaction);
			}
			else if (interaction.isCommand()) {
				await slashCommand.execute(interaction);
			}
			else if (interaction.isMessageContextMenu()) {
				return;
			}
			else if (interaction.isUserContextMenu()) {
				return;
			}
			else if (interaction.isAutocomplete()) {
				await autoComplete.execute(interaction);
			}
			else {
				return;
			}
		}
		catch (error) {
			console.log(`Error running interaction ${interaction.id ?? 'unknown id'}`);
		}
	},
};