const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'randomreddit', // command name
	description: 'Gets random post from specified subreddit.', // command description
	usage: '<subreddit without the r/>', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
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
		let subreddit = interaction.options.getString('subreddit');
		if (!interaction.options.getString('subreddit')) {
			subreddit = 'random';
		}
		else {
			subreddit = interaction.options.getString('subreddit');
		}
		try {
			await fetch(`https://www.reddit.com/r/${subreddit}/random/.json`, { method: 'Get' }) // random reddit post
				.then(async response => {
					const [list] = await response.json();
					const [post] = list.data.children;
					const type = post.data.post_hint;

					if (type !== 'image') {
						let posttitle = post.data.title;
						const permalink = post.data.permalink;
						const posturl = `https://reddit.com${permalink}`;
						const postupvotes = post.data.ups;
						const postcomments = post.data.num_comments;
						const nsfw = post.data.over_18;
						const description = post.data.selftext;
						const postauthor = `u/${post.data.author}`;
						const posttime = post.data.created * 1000;
						const footer = `👍 ${postupvotes} 💬 ${postcomments} • r/${post.data.subreddit}`;
						if (nsfw === true && interaction.channel.nsfw !== true) {
							interaction.reply({ content: 'Oops! thats a nsfw post, either try again, or set this channel to nsfw', ephemeral: true });
							return;
						}
						if (nsfw === true) {
							posttitle = `[NSFW] ${posttitle}`;
						}
						const redditembed = new EmbedBuilder()
							.setTitle(posttitle)
							.setURL(posturl)
							.setColor('Random')
							.setFooter({ text: footer })
							.setDescription(description)
							.setTimestamp(posttime)
							.setAuthor({ name: postauthor, iconURL: 'https://www.redditinc.com/assets/images/site/reddit-logo.png', url: `https://reddit.com/${postauthor}` });

						try {
							await interaction.reply({ embeds: [redditembed] });
						}
						catch (error) {
							const returnError = { message: error.message, stack: error.stack, code: 413, report: false, myMessage: `Error sending embed, something might be too long, check out the post yourself here: <https://reddit.com${post.data.permalink}>` };
							throw returnError;
						}
					}
					else {
						const permalink = post.data.permalink;
						const postUrl = `https://reddit.com${permalink}`;
						const postImage = post.data.url;
						let postTitle = post.data.title;
						const postUpvotes = post.data.ups;
						const postNumComments = post.data.num_comments;
						const nsfw = post.data.over_18;
						const postauthor = `u/${post.data.author}`;
						const posttime = post.data.created * 1000;
						const footer = `👍 ${postUpvotes} 💬 ${postNumComments} • r/${post.data.subreddit}`;
						if (nsfw === true && interaction.channel.nsfw !== true) {
							interaction.reply({ content: 'Oops, that one is nsfw, either try again, or set this channel to nsfw', ephemeral: true });
							return;
						}
						if (nsfw === true) {
							postTitle = `[NSFW] ${postTitle}`;
						}
						const redditembed = new EmbedBuilder()
							.setTitle(`${postTitle}`)
							.setURL(`${postUrl}`)
							.setColor('Random')
							.setImage(postImage)
							.setFooter({ text: footer })
							.setTimestamp(posttime)
							.setAuthor({ name: postauthor, iconURL: 'https://www.redditinc.com/assets/images/site/reddit-logo.png', url: `https://reddit.com/${postauthor}` });

						try {
							await interaction.reply({ embeds: [redditembed] });
						}
						catch (error) {
							const returnError = { message: error.message, stack: error.stack, code: 413, report: false, myMessage: `Error sending embed, something might be too long, check out the post yourself here: <https://reddit.com${post.data.permalink}>` };
							throw returnError;
						}
					}
				});
		}
		catch (error) {
			if (error.myMessage) throw error;
			const returnError = { message: error.message, stack: error.stack, code: 404, report: false, myMessage: 'Error completing your request, did you spell the subreddit right?' };
			throw returnError;
		}
	},
};
