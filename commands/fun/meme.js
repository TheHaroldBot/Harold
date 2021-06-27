const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'meme', //command name
	description: 'Gets a random meme from r/dankmemes', //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: .5, //cooldown in seconds, defaults to 3
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
		const embed = new Discord.MessageEmbed();
        	got('https://www.reddit.com/r/dankmemes/random/.json') //get random meme from r/dankmemes
        		.then(response => {
	        		const [list] = JSON.parse(response.body);
	        		const [post] = list.data.children;

	        		const permalink = post.data.permalink;
	        		const memeUrl = `https://reddit.com${permalink}`;
	        		const memeImage = post.data.url;
	        		const memeTitle = post.data.title;
	        		const memeUpvotes = post.data.ups;
	        		const memeNumComments = post.data.num_comments;
	        		if (post.data.over_18 === true && message.channel.nsfw !== true) {
        				message.channel.send('Oops, that one is nsfw, either try again, or set this channel to nsfw')
        				return
        			}

        			const memeembed = new Discord.MessageEmbed()
        			.setTitle(`${memeTitle}`)
        			.setURL(`${memeUrl}`)
        			.setColor('RANDOM')
        			.setImage(memeImage)
        			.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments}`)

	        		message.channel.send(memeembed).catch(err => {
	        			console.log(err)
	        			fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
	        			message.channel.send(`Error sending embed, something must be too long, check out the post yourself here: <https://reddit.com${post.data.permalink}>`)
	        		});	
	        	})
	        	.catch(err => {
	        		console.log(err)
	        		fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
	        		message.channel.send('There was an error completing your request, try again later!')
	        	})
	},
};