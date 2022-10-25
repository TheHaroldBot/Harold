const { PermissionFlagsBits, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getRedditPost } = require('../functions');

module.exports = {
	name: 'meme', // command name
	description: 'Gets a random meme from r/dankmemes', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Gets a random meme from r/dankmemes'),

	async execute(interaction) { // inside here command stuff
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Reroll')
					.setStyle(ButtonStyle.Primary)
					.setCustomId('redditreroll'), // remove if style is LINK
			);
		const post = await getRedditPost('dankmemes');
		console.log(post.redditembed);
		await interaction.reply({ embeds: [post.redditembed], components: [row] });
	},
};
