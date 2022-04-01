const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'randomreddit', // command name
	description: 'Gets random post from specified subreddit.', // command description
	usage: '<subreddit without the r/>', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: ['redditpost', 'reddit', 'rr'],
	data: new SlashCommandBuilder()
		.setName('randomreddit')
		.setDescription('Gets random post from a specified subreddit.')
		.addStringOption(option =>
			option.setName('subreddit')
				.setRequired(false)
				.setDescription('The subreddit to get a post from.')),

	async execute(interaction) { // inside here command stuff
		let subreddit = interaction.options.getString('subreddit');
		if (!interaction.options.getString('subreddit')) {
			subreddit = 'random';
		}
		else {
			subreddit = interaction.options.getString('subreddit');
		}
		try {
			await got(`https://www.reddit.com/r/${subreddit}/random/.json`) // random reddit post
				.then(async response => {
					const [list] = JSON.parse(response.body);
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
						const redditembed = new Discord.MessageEmbed()
							.setTitle(posttitle)
							.setURL(posturl)
							.setColor('RANDOM')
							.setFooter(footer)
							.setDescription(description)
							.setTimestamp(posttime)
							.setAuthor(postauthor, 'https://www.redditinc.com/assets/images/site/reddit-logo.png', `https://reddit.com/${postauthor}`);

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
						const redditembed = new Discord.MessageEmbed()
							.setTitle(`${postTitle}`)
							.setURL(`${postUrl}`)
							.setColor('RANDOM')
							.setImage(postImage)
							.setFooter(footer)
							.setTimestamp(posttime)
							.setAuthor(postauthor, 'https://www.redditinc.com/assets/images/site/reddit-logo.png', `https://reddit.com/${postauthor}`);

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
