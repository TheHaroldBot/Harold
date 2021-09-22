const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'meme', //command name
	description: 'Gets a random meme from r/dankmemes', //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: .5, //cooldown in seconds, defaults to 3
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
        	got('https://www.reddit.com/r/dankmemes/random/.json') //get random meme from r/dankmemes
        		.then(response => {
	        		const [list] = JSON.parse(response.body);
	        		const [post] = list.data.children;

	        		let permalink = post.data.permalink;
	        		let memeUrl = `https://reddit.com${permalink}`;
	        		let memeImage = post.data.url;
	        		let memeTitle = post.data.title;
	        		let memeUpvotes = post.data.ups;
	        		let memeNumComments = post.data.num_comments;
					let nsfw = post.data.over_18
	        		if (nsfw === true && message.channel.nsfw !== true) {
        				message.channel.send('Oops, that one is nsfw, either try again, or set this channel to nsfw')
        				return
        			}
					if (nsfw === true) {
						memeTitle = `[NSFW] ${memeTitle}` 
					}

        			const memeembed = new Discord.MessageEmbed()
        			.setTitle(`${memeTitle}`)
        			.setURL(`${memeUrl}`)
        			.setColor('RANDOM')
        			.setImage(memeImage)
				.setAuthor(postauthor, 'https://www.redditinc.com/assets/images/site/reddit-logo.png')
        			.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments}`)

	        		message.channel.send({ embeds: [memeembed]}).catch(err => {
	        			console.log(err)
	        			fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
	        			message.channel.send(`Error sending embed, something might be too long, check out the post yourself here: <https://reddit.com${post.data.permalink}>`)
	        		});	
	        	})
	        	.catch(err => {
	        		console.log(err)
	        		fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
	        		message.channel.send('There was an error completing your request, try again later!')
	        	})
	},
};
