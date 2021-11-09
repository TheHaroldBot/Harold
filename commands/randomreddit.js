const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'randomreddit', //command name
	description: 'Gets random post from specified subreddit.', //command description
    usage: `<subreddit without the r/>`, //usage instructions w/o command name and prefix
	cooldown: .5, //cooldown in seconds, defaults to 3
	aliases: ['redditpost', 'reddit', 'rr'],
	execute(message, args, prefix) { //inside here command stuff
		let subreddit = args[0]
		if(!args.length){
			subreddit = 'random'
		} else {
			subreddit = args[0]
		}
		got(`https://www.reddit.com/r/${subreddit}/random/.json`) //random reddit post
	        	.then(response => {
	        		const [list] = JSON.parse(response.body);
	        		const [post] = list.data.children;
	        		const type = post.data.post_hint
                
	        		if(type !== 'image') {
	        			let posttitle = post.data.title
	        			let permalink = post.data.permalink
	        			let posturl = `https://reddit.com${permalink}`
	        			let postupvotes = post.data.ups
	        			let postcomments = post.data.num_comments
	        			let nsfw = post.data.over_18
	        			let description = post.data.selftext
	        			let postauthor = `u/${post.data.author}`
					let posttime = post.data.created * 1000
					let footer = `👍 ${postupvotes} 💬 ${postcomments} • r/${post.data.subreddit}`
	        			if(nsfw === true && message.channel.nsfw !== true) {
	        				message.channel.send('Oops! thats a nsfw post, either try again, or set this channel to nsfw')
	        				return
	        			}
					if(nsfw === true) {
						posttitle = `[NSFW] ${posttitle}`
					}
	        			const redditembed = new Discord.MessageEmbed()
	        			.setTitle(posttitle)
	        			.setURL(posturl)
		        		.setColor('RANDOM')
		        		.setFooter(footer)
		        		.setDescription(description)
					.setTimestamp(posttime)
		        		.setAuthor(postauthor, 'https://www.redditinc.com/assets/images/site/reddit-logo.png', `https://reddit.com/${postauthor}`)
				
		        		message.channel.send({ embeds: [redditembed]}).catch(err => {
		        			console.log(err)
		        			message.channel.send(`Error sending embed, something must be too long, check out the post yourself here: <https://reddit.com${post.data.permalink}>`)
		        		});	
		        	} else {
		        	let permalink = post.data.permalink;
		        	let postUrl = `https://reddit.com${permalink}`;
		        	let postImage = post.data.url;
		        	let postTitle = post.data.title;
		        	let postUpvotes = post.data.ups;
		        	let postNumComments = post.data.num_comments;
				let nsfw = post.data.over_18;
		        	let postauthor = `u/${post.data.author}`
				let posttime = post.data.created * 1000
				let footer = `👍 ${postUpvotes} 💬 ${postNumComments} • r/${post.data.subreddit}`
		        	if (nsfw === true && message.channel.nsfw !== true) {
		        		message.channel.send('Oops, that one is nsfw, either try again, or set this channel to nsfw')
		        		return
		        	}
				if (nsfw === true) {
					postTitle = `[NSFW] ${postTitle}`
				}
		        	const redditembed = new Discord.MessageEmbed()
		        	.setTitle(`${postTitle}`)
		        	.setURL(`${postUrl}`)
		        	.setColor('RANDOM')
		        	.setImage(postImage)
		        	.setFooter(footer)
				.setTimestamp(posttime)
		        	.setAuthor(postauthor, 'https://www.redditinc.com/assets/images/site/reddit-logo.png', `https://reddit.com/${postauthor}`)

		        	message.channel.send({ embeds: [redditembed]}).catch(err => {
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