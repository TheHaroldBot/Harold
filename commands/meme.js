const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'meme', // command name
	description: 'Gets a random meme from r/dankmemes', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Gets a random meme from r/dankmemes'),

	async execute(interaction) { // inside here command stuff
		await fetch('https://www.reddit.com/r/dankmemes/random/.json', { method: 'Get' }) // get random meme from r/dankmemes
			.then(async response => {
				const [list] = await response.json();
				const [post] = list.data.children;

				const permalink = post.data.permalink;
				const memeUrl = `https://reddit.com${permalink}`;
				const memeImage = post.data.url;
				let memeTitle = post.data.title;
				const memeUpvotes = post.data.ups;
				const memeNumComments = post.data.num_comments;
				const posttime = post.data.created * 1000;
				const nsfw = post.data.over_18;
				const postauthor = `u/${post.data.author}`;
				if (nsfw === true && interaction.channel.nsfw !== true) {
					interaction.reply({ content: 'Oops, that one is nsfw, either try again, or set this channel to nsfw', ephemeral: true });
					return;
				}
				if (nsfw === true) {
					memeTitle = `[NSFW] ${memeTitle}`;
				}

				const memeembed = new Discord.MessageEmbed()
					.setTitle(`${memeTitle}`)
					.setURL(`${memeUrl}`)
					.setColor('RANDOM')
					.setImage(memeImage)
					.setAuthor({ name: postauthor, iconUrl: 'https://www.redditinc.com/assets/images/site/reddit-logo.png', url: `https://reddit.com/${postauthor}` })
					.setFooter({ text: `👍 ${memeUpvotes} 💬 ${memeNumComments} • r/${post.data.subreddit}` })
					.setTimestamp(posttime);

				interaction.reply({ embeds: [memeembed] }).catch(err => {
					const returnError = { message: err.message, stack: err.stack, code: 500, report: false, myMessage: `Error sending embed, something might be too long, check out the post yourself here: <https://reddit.com${post.data.permalink}>` };
					throw returnError;
				});
			})
			.catch(err => {
				const returnError = { message: err.message, stack: err.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
				throw returnError;
			});
	},
};
