const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json');
const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const options = ['summer', 'fall', 'winter', 'spring', 'christmas', 'halloween', 'easter', 'hanukkah', 'clear'];

module.exports = {
	name: 'decorate', // command name
	description: `Decorate channels. Run \`${config.prefix}decor clear\` first if you already have emojis on it to clear them. Due to Discord rate limiting, this command can only be run once every 5 minutes.\nIf you bypass this rate limit by using multiple people, note that it will work, but it will be delayed.`, // command description
	args: true, // needs arguments? delete line if no
	usage: `<${options.join('|')}>`, // usage instructions w/o command name and prefix
	guildOnly: true, // execute in a guild only? remove line if no
	cooldown: 300, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels], // permissions bot needs for command
	aliases: ['decor'],
	data: new SlashCommandBuilder()
		.setName('decorate')
		.setDescription('Decorate channels with fancy emojis!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.setDMPermission(false),

	async execute(interaction) { // inside here command stuff
		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('decorate')
					.setPlaceholder('Pick a theme!')
					.addOptions([
						{
							label: 'Summer',
							value: 'summer',
							description: '🌞 A summer theme!',
						},
						{
							label: 'Fall',
							value: 'fall',
							description: '🍂 A fall theme!',
						},
						{
							label: 'Winter',
							value: 'winter',
							description: '❄️ A winter theme!',
						},
						{
							label: 'Spring',
							value: 'spring',
							description: '🌻 A spring theme!',
						},
						{
							label: 'Christmas',
							value: 'christmas',
							description: '🎅 A christmas theme!',
						},
						{
							label: 'Halloween',
							value: 'halloween',
							description: '🎃 A Halloween theme!',
						},
						{
							label: 'Easter',
							value: 'easter',
							description: '🐇 An Easter theme!',
						},
						{
							label: 'Hanukkah',
							value: 'hanukkah',
							description: '🕎 A Hanukkah theme!',
						},
						{
							label: 'Clear',
							value: 'clear',
							description: '🧹 Begone decor!',
						},
					]),
			);
		interaction.reply({ components: [row], ephemeral: true });
	},
};
