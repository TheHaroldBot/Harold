const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'randomreddit', //command name
	description: 'Gets random post from specified subreddit.', //command description
	args: true, //needs arguments? delete line if no
    usage: `<subreddit without the r/>`, //usage instructions w/o command name and prefix
	cooldown: .5, //cooldown in seconds, defaults to 3
	aliases: ['redditpost', 'reddit'],
	execute(message, args, prefix) { //inside here command stuff
		got(`https://www.reddit.com/r/${args[0]}/random/.json`) //random reddit post
	        	.then(response => {
	        		const [list] = JSON.parse(response.body);
	        		const [post] = list.data.children;
	        		const type = post.data.post_hint
                
	        		if(type !== 'image') {
	        			const posttitle = post.data.title
	        			const permalink = post.data.permalink
	        			const posturl = `https://reddit.com${permalink}`
	        			const postupvotes = post.data.ups
	        			const postcomments = post.data.num_comments
	        			const nsfw = post.data.over_18
	        			const description = post.data.selftext
	        			const postauthor = `u/${post.data.author}`

	        			if(nsfw === true && message.channel.nsfw !== true) {
	        				message.channel.send('Oops! thats a nsfw post, either try again, or set this channel to nsfw')
	        				return
	        			}
	        			const redditembed = new Discord.MessageEmbed()
	        			.setTitle(posttitle)
	        			.setURL(posturl)
		        		.setColor('RANDOM')
		        		.setFooter(`👍 ${postupvotes} 💬 ${postcomments}`)
		        		.setDescription(description)
		        		.setAuthor(postauthor, 'https://www.redditinc.com/assets/images/site/reddit-logo.png')
				
		        		message.channel.send(redditembed).catch(err => {
		        			console.log(err)
		        			message.channel.send(`Error sending embed, something must be too long, check out the post yourself here: <https://reddit.com${post.data.permalink}>`)
		        		});	
		        	} else {
		        	const permalink = post.data.permalink;
		        	const postUrl = `https://reddit.com${permalink}`;
		        	const postImage = post.data.url;
		        	const postTitle = post.data.title;
		        	const postUpvotes = post.data.ups;
		        	const postNumComments = post.data.num_comments;
		        	const postauthor = `u/${post.data.author}`
		        	if (post.data.over_18 === true && message.channel.nsfw !== true) {
		        		message.channel.send('Oops, that one is nsfw, either try again, or set this channel to nsfw')
		        		return
		        	}
		        	const redditembed = new Discord.MessageEmbed()
		        	.setTitle(`${postTitle}`)
		        	.setURL(`${postUrl}`)
		        	.setColor('RANDOM')
		        	.setImage(postImage)
		        	.setFooter(`👍 ${postUpvotes} 💬 ${postNumComments}`)
		        	.setAuthor(postauthor, 'https://www.redditinc.com/assets/images/site/reddit-logo.png')

		        	message.channel.send(redditembed).catch(err => {
		        		console.log(err)
			        	message.channel.send(`Error sending embed, something must be too long, check out the post yourself here: <https://reddit.com${post.data.permalink}>`)
		        	});	
		        	}
	        	})
	        	.catch(err => {
		        	console.log(err)
		        	message.channel.send('There was an error completing your request, did you spell the subreddit right?')
		        });
			
    },
};