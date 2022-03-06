const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'meme', // command name
	description: 'Gets a random meme from r/dankmemes', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: [],
	execute(message) { // inside here command stuff
		got('https://www.reddit.com/r/dankmemes/random/.json') // get random meme from r/dankmemes
			.then(response => {
				const [list] = JSON.parse(response.body);
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
				if (nsfw === true && message.channel.nsfw !== true) {
					message.reply('Oops, that one is nsfw, either try again, or set this channel to nsfw');
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
					.setAuthor(postauthor, 'https://www.redditinc.com/assets/images/site/reddit-logo.png', `https://reddit.com/${postauthor}`)
					.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments} • r/${post.data.subreddit}`)
					.setTimestamp(posttime);

				message.reply({ embeds: [memeembed] }).catch(err => {
					console.log(err);
					message.reply(`Error sending embed, something might be too long, check out the post yourself here: <https://reddit.com${post.data.permalink}>`);
				});
			})
			.catch(err => {
				console.log(err);
				message.reply('There was an error completing your request, try again later!');
			});
	},
};
