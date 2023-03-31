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
		interaction.deferReply();
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Reroll')
					.setStyle(ButtonStyle.Primary)
					.setCustomId('redditreroll'), // remove if style is LINK
			);
		let pass = false;
		let count = 0;
		while (pass === false && count < 5) {
			try {
				const post = await getRedditPost('dankmemes');
				if (!post || (post.nsfw === true && interaction.channel.nsfw !== true)) {
					pass = false;
				}
				else {
					pass = true;
					await interaction.editReply({ embeds: [post.redditembed], components: [row] });
				}
			}
			catch (error) {
				// nothing, just the post not existing.
			}
			count = count + 1;
		}
		if (count >= 5) await interaction.editReply({ content: 'Something went wrong! Try again or try another subreddit.', ephemeral: true });
	},
};
