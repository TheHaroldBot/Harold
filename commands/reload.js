const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'reload', // command name
	description: 'Reloads a command', // command description
	usage: '<command>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	args: true,
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command')
		.addStringOption(option =>
			option.setName('type')
				.setRequired(true)
				.setDescription('The type of thing you want to reload.')
				.addChoices(
					{
						name: 'Command',
						value: 'command',
					},
					{
						name: 'Button',
						value: 'button',
					},
					{
						name: 'Menu',
						value: 'selectMenu',
					},
				))
		.addStringOption(option =>
			option.setName('name')
				.setRequired(true)
				.setAutocomplete(true)
				.setDescription('The name or custom ID of the thing you want to reload.')),
	autoComplete: async (interaction) => {
		const currentValue = interaction.options.getFocused();
		const commands = interaction.client.commands;
		const buttons = interaction.client.buttons;
		const selectMenus = interaction.client.selectMenus;
		const toRespond = [];
		if (interaction.options.getString('type') === 'command') {
			await commands.forEach(command => {
				if (command.name.startsWith(currentValue)) {
					toRespond.push({
						name: command.name,
						value: command.name,
					});
				}
			});
		}
		else if (interaction.options.getString('type') === 'button') {
			await buttons.forEach(button => {
				if (button.customId.startsWith(currentValue)) {
					toRespond.push({
						name: button.customId,
						value: button.customId,
					});
				}
			});
		}
		else if (interaction.options.getString('type') === 'selectMenu') {
			await selectMenus.forEach(selectMenu => {
				if (selectMenu.customId.startsWith(currentValue)) {
					toRespond.push({
						name: selectMenu.customId,
						value: selectMenu.customId,
					});
				}
			});
		}
		return toRespond;
	},

	async execute(interaction) {
		if (interaction.options.getString('type') === 'command') {
			const commandName = interaction.options.getString('name');
			const command = interaction.client.commands.get(commandName)
				|| interaction.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) {
				const returnError = { message: 'invalid command supplied', stack: 'reload command not found', code: 404, report: false, myMessage: 'That doesen\'t seem to be a command!' };
				throw returnError;
			}

			delete require.cache[require.resolve(`../commands/${command.name}.js`)];

			try {
				const newCommand = require(`../commands/${command.name}.js`);
				interaction.client.commands.set(newCommand.name, newCommand);
				interaction.reply(`Command \`${newCommand.name}\` was reloaded!`);
			}
			catch (error) {
				interaction.reply({ content: `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``, ephemeral: true });
				throw new Error(error.stack);
			}
		}
		else if (interaction.options.getString('type') === 'button') {
			const buttonName = interaction.options.getString('name');
			const button = await interaction.client.buttons.get(buttonName);

			if (!button) {
				const returnError = { message: 'invalid button supplied', stack: 'reload button not found', code: 404, report: false, myMessage: 'That doesen\'t seem to be a button!' };
				throw returnError;
			}
			delete require.cache[require.resolve(`../buttons/${button.customId}.js`)];

			try {
				const newButton = require(`../buttons/${button.customId}.js`);
				interaction.client.buttons.set(newButton.customId, newButton);
				interaction.reply(`Button \`${newButton.customId}\` was reloaded!`);
			}
			catch (error) {
				interaction.reply({ content: `There was an error while reloading a button \`${button.name}\`:\n\`${error.message}\``, ephemeral: true });
				throw new Error(error.stack);
			}
		}
		else if (interaction.options.getString('type') === 'selectMenu') {
			const selectMenuName = interaction.options.getString('name');
			const selectMenu = interaction.client.selectMenus.get(selectMenuName);

			if (!selectMenu) {
				const returnError = { message: 'invalid select menu supplied', stack: 'reload select menu not found', code: 404, report: false, myMessage: 'That doesen\'t seem to be a select menu!' };
				throw returnError;
			}
			delete require.cache[require.resolve(`../selectMenus/${selectMenu.customId}.js`)];

			try {
				const newSelectMenu = require(`../selectMenus/${selectMenu.customId}.js`);
				interaction.client.selectMenus.set(newSelectMenu.customId, newSelectMenu);
				interaction.reply(`Select menu \`${newSelectMenu.customId}\` was reloaded!`);
			}
			catch (error) {
				interaction.reply({ content: `There was an error while reloading a select menu \`${selectMenu.name}\`:\n\`${error.message}\``, ephemeral: true });
				throw new Error(error.stack);
			}
		}
	},
};