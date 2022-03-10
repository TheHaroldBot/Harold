const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'setstream', // command name
	description: 'Sets the bot\'s streaming status.', // command description
	usage: '<url> <name>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['stream'],
	data: new SlashCommandBuilder()
		.setName('setstream')
		.setDescription('Sets the bot\'s streaming status.')
		.addStringOption(option =>
			option.setName('url')
				.setRequired(true)
				.setDescription('The stream url.'))
		.addStringOption(option =>
			option.setName('name')
				.setRequired(true)
				.setDescription('The stream name.')),

	execute(interaction) { // inside here command stuff
		interaction.client.user.setActivity(interaction.options.getString('name')), {
			type: 'STREAMING',
			url: interaction.options.getString('url'),
		};
		interaction.reply(`Streaming ${interaction.options.getString('name')} at \`${interaction.options.getString('url')}\``);
	},
};