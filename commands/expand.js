const { SlashCommandBuilder } = require('@discordjs/builders');
const { tall } = require('tall');

module.exports = {
	name: 'expand', // command name
	description: 'Expand a URL', // command description
	args: true, // needs arguments? delete line if no
	usage: '<url>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: ['urlexpand'],
	data: new SlashCommandBuilder()
		.setName('expand')
		.setDescription('Expand a URL')
		.addStringOption(option =>
			option.setName('url')
				.setRequired(true)
				.setDescription('The URL to expand.')),

	execute(interaction) { // inside here command stuff
		tall(interaction.options.getString('url'))
			.then(unshortenedUrl => interaction.reply(`Expanded URL: ${unshortenedUrl}`));
	},
};