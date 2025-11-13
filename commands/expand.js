const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { tall } = require('tall');

module.exports = {
	name: 'expand', // command name
	description: 'Expand a URL', // command description
	args: true, // needs arguments? delete line if no
	usage: '<url>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	aliases: ['urlexpand'],
	data: new SlashCommandBuilder()
		.setName('expand')
		.setDescription('Expand a URL')
		.addStringOption(option =>
			option.setName('url')
				.setRequired(true)
				.setDescription('The URL to expand.')),

	async execute(interaction) { // inside here command stuff
		try {
			await tall(interaction.options.getString('url'))
				.then(async unshortenedUrl => await interaction.reply(`Expanded URL: ${unshortenedUrl}`));
		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 400, report: false, myMessage: 'Did you provde a valid URL?' };
			throw returnError;
		}
	},
};