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
			option.setName('command')
				.setRequired(true)
				.setDescription('The command to reload.')),

	execute(interaction) {
		const commandName = interaction.options.getString('command').toLowerCase();
		const command = interaction.client.commands.get(commandName)
			|| interaction.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return interaction.reply({ content: `There is no command with name or alias \`${commandName}\`, ${interaction.user.username}!`, ephemeral: true });
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
	},
};