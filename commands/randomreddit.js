// Credit to Monbrey#4502 on Discord for helping me out on a bit of processing

const { PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { getRedditPost } = require('../functions');

module.exports = {
	name: 'randomreddit', // command name
	description: 'Gets random post from specified subreddit.', // command description
	usage: '<subreddit without the r/>', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	aliases: ['redditpost', 'reddit', 'rr'],
	data: new SlashCommandBuilder()
		.setName('randomreddit')
		.setDescription('Gets random post from a specified subreddit.')
		.addStringOption(option =>
			option.setName('subreddit')
				.setRequired(false)
				.setAutocomplete(true)
				.setDescription('The subreddit to get a post from.')),
	autoComplete: async (interaction) => {
		const currentValue = interaction.options.getFocused();
		const toRespond = [];
		if (!currentValue) return toRespond;
		await fetch(`https://www.reddit.com/subreddits/search.json?q=${currentValue}&include_over_18=on`, { method: 'Get' })
			.then(async response => {
				const list = await response.json();
				const subreddits = list.data.children;
				subreddits.forEach(subreddit => {
					if (subreddit.data.over18 === true && interaction.channel.nsfw === false) return;
					toRespond.push({
						name: subreddit.data.display_name,
						value: subreddit.data.display_name,
					});
				});
			});
		return toRespond;
	},

	async execute(interaction) { // inside here command stuff
		interaction.deferReply();
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Reroll')
					.setStyle(ButtonStyle.Primary)
					.setCustomId('redditreroll'), // remove if style is LINK
			);

		let subreddit = interaction.options.getString('subreddit');
		if (!interaction.options.getString('subreddit')) {
			subreddit = 'random';
		}
		try {
			let pass = false;
			let count = 0;
			while (pass === false && count < 5) {
				try {
					const post = await getRedditPost(subreddit);
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
		}
		catch (error) {
			if (error.myMessage) throw error;
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Error completing your request, we reported this error and will look in to it.' };
			throw returnError;
		}
	},
};