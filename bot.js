/*
A mascot and quality of life discord bot, mainly for the purpose of entertaining me.
    Copyright (C) 2021  John Gooden

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/



const Discord = require('discord.js');
const Webhook = require('discord.js');
const { Attatchment } = require('discord.js')
const path = require("path")
const fs = require("fs")
const discordInv = require('discord-inv');
const util = require('minecraft-server-util');
const removeFromArray = require('remove-from-array')
const got = require('got');
const ytdl = require("ytdl-core")
const { TIMEOUT } = require('dns');
const fetch = require('node-fetch');
const reportwebhook = new Discord.WebhookClient('809818709144633415', 'JW8sEYjgkYlG7pbg0Go4jb4-HYI6OgyRzh__OB4ZP2cNlsFnQ1dRn-uqCfaVmX0OsNG-')
const suggestionwebhook = new Discord.WebhookClient('824303438292582451', 'Ux76_IeqplB1IQdBSPrS7iQ5Wzalpfn1iP3-H78UKbNt-AQsAXVGmDf__1aTQA3jg2C7')
const { token, ownerid, botid, ignoreofflinecallout, ignore } = require('./config.json');
const prefix = "*"
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
  })
const client = new Discord.Client();
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();


client.once('ready', () => {
	console.log('Kinetic SMP Bot  Copyright (C) 2021  John Gooden')
	console.log('Copyright info: https://github.com/Kinetic-SMP/KineticSMPBot/blob/main/LICENCE\n\n')
});

let isHibernating = false; //Global (top level) variable
const Hibernate = (client) => {
    if(!client){ return(false) }
    client.user.setPresence({ //Sets detailed presence
        activity: {
            name: "Hibernation",
            type: "PLAYING"
        },
        status: 'idle',
        afk: true
    });
    isHibernating = true;
}

client.on('message', message => {
  if(message.content.includes(`${prefix}hibernate_off`)) { //hibernate off listener
	  if(message.author.id !== ownerid) return
	  isHibernating = false
	  client.user.setPresence({ //Sets detailed presence
        activity: {
            name: "",
            type: "PLAYING"
        },
        status: 'online',
        afk: false
    });
	message.channel.send('Im back!')
  }
  if(isHibernating){ return(false) } //Bot is Hibernating
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
   if(message.webhookID) return;
   if(message.guild === null) { //log dms
	console.log(`DM From: ${message.author.tag} > ${message.content}`)
	fs.appendFileSync('chatlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `DM From: ${message.author.tag} > ${message.content}\n`)
	if(message.content.startsWith(prefix)) {
		message.author.send('Commands can only be run from a server, not a dm.') //tell them off for trying to run commands in a dm
	}
	return
} else {
	console.log(`From: ${message.author.tag} > ${message.content}`) //log guild messages
	fs.appendFileSync('chatlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `From: ${message.author.tag} > ${message.content}\n`)
}
  if(!message.content.startsWith(prefix)) return //starting now, ignore messages without prefix
  let botblocked = JSON.parse(fs.readFileSync('blocked.json'))
  if(botblocked.blocked.includes(ownerid) && message.author.id === ownerid) {
	  message.author.send('You have been blocked by the bot! As the bot owner, this is an issue, go to the blocked.json file to remove yourself.')
	  return
  }
  if(botblocked.blocked.includes(message.author.id)) return
  if(message.author.bot) return //ignore bots
  if (message.content === `${prefix}ping`) {
	message.channel.send(`🏓 API Latency is ${Math.round(client.ws.ping)}ms`); //find ping, idk if this is accurate, but it gives a number and people believe it, so idrc
} else if (message.content === `${prefix}count`) {
	message.channel.send(`Current member count: ${message.guild.memberCount}`); //gives server member count
} else if (command === 'args') {
  message.channel.send(args) //sends arguments
} else if (command === 'help') {
	if(!args.length) {
		const helpembed = new Discord.MessageEmbed() //ooo a help command, not always up to date, because i forget, or i just dont care
	.setColor('RANDOM')
	.setTitle('Help Page')
	.addFields(
		{ name: '**Categories:**', value: 'General\nUtility\nMusic\nFun\nPolls'}
	)
	message.channel.send(helpembed);
	} else {
		const commands = JSON.parse((fs.readFileSync('./help.json')))
		if (!commands.categories.includes(args[0])) {
			if(commands.descriptions[args[0]] === undefined) return(message.channel.send('I don\'t see that command or category, check your spelling and try again!'))
			const commandembed = new Discord.MessageEmbed()
			.setTitle(args[0])
			.setColor('RANDOM')
			.setDescription(`${commands.descriptions[args[0]]}`)
			message.channel.send(commandembed).catch((err) => {
				console.log(err)
				fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)

			})
			return
		}
		const helpembed = new Discord.MessageEmbed()
		.setTitle(args[0])
		.setColor('RANDOM')
		.setDescription(commands.list[args[0]])
		.addField("More info", `To get info on a command, do \`${prefix}help <command>\``)
		message.channel.send(helpembed).catch((err) => {
			console.log(err)
			fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
		})
	}
	
} else if (command === "debug") {
	const debugembed = new Discord.MessageEmbed() //debug commands
	.setColor('RANDOM')
	.setTitle('Debugging')
	.addFields(
		{ name: 'Commands:', value: '**args** - sends the arguments in your message\n**argsinfo** - sends command and arguments\n**shutdown** - shuts down the bot\n**content** - sends the contents of a message'}
	)
	message.react('📬')
	message.author.send(debugembed); //again in dm, cuz the help cmd is so might as well this one too
} else if (command === 'spam') {
  if (!args.length) {
  		return message.channel.send('u didnt say what to spam') //spams messages, only 5 times, cuz i dont like spam in my general chat
  }
  message.delete()
  message.channel.send(message.content.replace(`${prefix}spam`, ""));
  message.channel.send(message.content.replace(`${prefix}spam`, ""));
  message.channel.send(message.content.replace(`${prefix}spam`, ""));
  message.channel.send(message.content.replace(`${prefix}spam`, ""));
  message.channel.send(message.content.replace(`${prefix}spam`, ""));
} else if (command === 'delete') {
	message.delete() //deletes your message. Really pointless, but i dont care. i was bored.
} else if (command === 'echo') {
	if (!args.length) {
		return message.channel.send('you didnt say anything to echo')
	}
	message.delete()
	message.channel.send(message.content.replace(`${prefix}echo`, "")); //tells you what you told it
} else if (command === 'serverinfo') {
  const serverinfoembed = new Discord.MessageEmbed() //command to find info on the server
	.setColor('RANDOM')
	.setTitle('Connection and Status Info')
	.addFields(
		{ name: 'IP:', value: 'mckineticsmp.com' },
		{ name: 'Port:', value: '25565' },
		{ name: 'Check Status in Discord:', value: '<#802204876514787338>' },
		{ name: 'Check Status Online:', value: 'http://cpanel.mckineticsmp.com' },
		{ name: 'Dynmap:', value: 'http://dynmap.mckineticsmp.com' }
	)
  message.channel.send(serverinfoembed)
} else if (command === 'intro') {
	const introembed = new Discord.MessageEmbed() //into for the bot
	.setColor('RANDOM')
	.setTitle('Intro')
	.addFields(
		{ name: 'Hello!', value: 'Thank you for adding me!'},
		{ name: 'Name:', value: 'Kinetic SMP Bot' },
		{ name: 'Purpose:', value: 'General Kinetic SMP stuff, qol bot, other stuff i dont want to write down bcuz im lazy.' },
		{ name: 'Commands:', value: `do ${prefix}help` },
		{ name: 'Things to know:', value: 'I am in beta, and will sometimes do stuff that isnt supposed to happen.'},
		{ name: 'Github:', value: 'https://github.com/Kinetic-SMP/KineticSMPBot'}
	)
	message.delete()
	message.channel.send(introembed)
} else if (command === 'shutdown') {
	if(message.author.id !== ownerid) {
		return message.channel.send("Sorry! Only the bot owner can do that.") //kills the bot, snipes it in the head
	} else {
		client.destroy()
	}
} else if (command === 'invite') {
	message.channel.send("https://discord.gg/dRmgSzhbVt") //gets discord invite for kinetic smp, i dont feel like automating it
} else if (command === 'github') {
	const githubembed = new Discord.MessageEmbed() //github link, embed because embeds look cool
	.setColor('RANDOM')
	.setTitle('Github')
	.setDescription('https://github.com/Kinetic-SMP/KineticSMPBot')
	message.channel.send (githubembed)
} else if (command === 'slowmode') {
	if (!args.length) {
		 return message.channel.send('you didnt say a slowmode time') //sets the slowmode, you didnt really need me to explain this did you? how dense are you?
	} else if (!message.member.hasPermission('MANAGE_CHANNELS')) {
		return message.channel.send ('you dont have permission to do that')
	} else {
		message.channel.setRateLimitPerUser(args[0], `${message.author.tag} requested a slowmode of ${args[0]} seconds.`)
		message.channel.send(`Success! Slowmode set to ${args[0]} seconds.`)
	}
} else if (command === 'log') {
	if (!args.length) {
		return message.channel.send('You didnt say anything to log!') //logs something to console, but only i can, so you dont need to care about it
	} else if (message.author.id !== ownerid) {
		return message.channel.send ('Only the bot owner can log messages to the console.')
	} else {
		const logcontent = message.content
		console.log('\x1b[32m\x1b[4m\x1b[1m%s', `Custom log: ${message.content.replace(`${prefix}log `, "")}`);
		fs.appendFileSync('chatlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `Custom log: ${message.content.replace(`${prefix}log `, "")}\n`)
		message.channel.send('Message logged!')
	}
} else if (command === 'setgame') {
	if (!args.length) {
		message.channel.send ('you need to name a status')
	} else if (message.author.id !== ownerid) {
		return message.channel.send ('Only the bot owner can change my status.') //sets the game the bot is playing, again, only me
	} else {
		client.user.setActivity(message.content.replace(`${prefix}setgame `, ""))
		message.channel.send(`Game set to ${message.content.replace(`${prefix}setgame `, "")}`)
	}
	 
} else if (command === 'setavatar') {
	if (!args.length) {
		message.channel.send ('you need to rovide a url')
	} else if (message.author.id !== ownerid) {
		return message.channel.send ('Only the owner can change my profile picture') //sets the bot avatar, only me can tho
	} else {
		client.user.setAvatar(args[0])
		message.channel.send('Avatar changed')
	}
} else if (command === 'setstatus') {
	if (!args.length) {
		message.channel.send ('You need to provide a status. Allowed values are:\nonline, idle, invisible, dnd') //sets presence, only me again
	} else if (message.author.id !== ownerid) {
		return message.channel.send('Only the owner can change my presence')
	} else if (args[0] === 'online') {
		client.user.setPresence({ status: 'online' })
		message.channel.send(`Status set to ${args[0]}`)
	} else if (args[0] === 'idle') {
		client.user.setPresence({ status: 'idle' })
		message.channel.send(`Status set to ${args[0]}`)
	} else if (args[0] === 'invisible') {
		client.user.setPresence({ status: 'invisible' })
		message.channel.send(`Status set to ${args[0]}`)
	} else if (args[0] === 'dnd') {
		client.user.setPresence({ status: 'dnd' })
		message.channel.send(`Status set to ${args[0]}`)
	} else {
		message.channel.send(`Invalid argument: ${args[0]}. Valid arguments are:\nonline, idle, invisible, dnd`)
	}
} else if (command === 'ownerhelp') {
	if (message.author.id !== ownerid) {
		return message.channel.send ('Only the bot owner can access this command.') //lists commands for the bot owner (me)
	} else {
		const ownerembed = new Discord.MessageEmbed()
		.setTitle('Owner Help Menu')
		.setColor('RANDOM')
		.setDescription('**setstatus** - sets the bot presence\n**setavatar** - sets the bot avatar\n**setgame** - sets the game the bot is playing\n**log** - logs information to the console\n**shutdown** - shuts down the bot\n**ownerhelp** - displays this embed\n**setstream** <url> <name> - sets a streaming status\n**block** - make the bot ignore someone\n**unblock** - make the bot resume working for someone\n**hibernate** - makes the bot go into low-power mode\n**hibernate_off** - turns off hibernate and enables normal bot functions')
		message.react('📬')
		message.author.send (ownerembed)
	}
} else if (command === 'yesorno') {
	const yesorno = (Math.random() < 0.5); //random yes or no. another pointless one.
	if (yesorno === true) {
		message.channel.send ('Yes')
	} else {
		message.channel.send ('No')
	}

} else if (command === 'profile') {
	if ((!message.member.hasPermission('ADMINISTRATOR'))) {
		message.channel.send('Only users with the ADMINISTRATOR permission can do that') //gets profile for someone, admins only bcuz yes
	} else if (!args.length) {
		const pfptarget = message.author
		const pfpembed = new Discord.MessageEmbed()
		.setColor('RANDOM')
		.setTitle(`Profile Image for: ${pfptarget.tag}`)
		.setImage(pfptarget.avatarURL({ dynamic: true, size: 256}))
		message.channel.send(pfpembed)
	} else {
		const pfptarget = message.mentions.users.first()
		const pfpembed = new Discord.MessageEmbed()
		.setColor('RANDOM')
		.setTitle(`Profile Image for: ${pfptarget.tag}`)
		.setImage(pfptarget.avatarURL({ dynamic: true, size: 256}))
		message.channel.send(pfpembed)
	}
} else if (command === 'report') {
	if (!args.length) {
		message.delete()
		message.author.send('you need to say something to report') //reports smth to the report channel only staff can see
	} else {
		const reportembed = new Discord.MessageEmbed()
		.setTitle(`Report from ${message.author.tag}`)
		.setColor('#ff0000')
		.setDescription(message.content.replace(`${prefix}report`, ""))
		reportwebhook.send("",{
		username: 'Kinetic SMP Report Bot',
		avatarURL: 'https://image.flaticon.com/icons/png/512/61/61114.png',
		embeds: [reportembed]
		})
		message.delete()
		message.author.send(`Your report was sent!\nWhat you reported: "${message.content.replace(`${prefix}report `, "")}"`)
	}
	
} else if (command === 'guildicon') {
	const guildicon = new Discord.MessageEmbed()
	.setColor('RANDOM')
	.setTitle(`Guild icon for: ${message.guild.name}`)
	.setImage(message.guild.iconURL({ dynamic: true, size: 256})) //gets the guild icon
	message.channel.send(guildicon)
} else if (command === 'leaveguild') {
	if ((!message.member.hasPermission('MANAGE_WEBHOOKS'))) {
		message.channel.send('You need MANAGE_WEBHOOKS permission to do that!')
	} else {
		message.channel.send('Goodbye!')
		console.log(`Now leaving ${message.guild.name}`)
		message.guild.leave()
	}
} else if (command === 'setstream') {
	if (!message.author.id === ownerid) {
		message.channel.send('only the bot owner can do that') //sets the stream of the bot
		return
	} else if (args.length < 2) {
		message.channel.send('you need to set a stream title *and* a url')
		return
	} else {
		client.user.setActivity(message.content.replace(`${prefix}setstream ${args[0]}`, ""), {
			type: "STREAMING",
			url: args[0]
		  });
		  message.channel.send(`Streaming ${message.content.replace(`${prefix}setstream ${args[0]}`, "")} at \`${args[0]}\``)
	}
} else if (command === 'suggest') {
	if (!args.length) {
		message.delete()
		message.author.send('you need to say something to suggest') //sends something to the suggestion channel
	} else {
		const suggestembed = new Discord.MessageEmbed()
		.setTitle(`Suggestion from ${message.author.tag}`)
		.setColor('#90fc03')
		.setDescription(message.content.replace(`${prefix}suggest `, ""))
		.setThumbnail(message.author.avatarURL())
		suggestionwebhook.send("",{
		username: 'Kinetic SMP Suggestion Bot',
		avatarURL: 'https://i.pinimg.com/originals/3a/24/a3/3a24a375af42657f11a1eb0d230f179f.png',
		embeds: [suggestembed]
		})
		message.delete()
		message.author.send(`Your suggestion was sent!\nWhat you suggested: "${message.content.replace(`${prefix}report `, "")}"`)
	}
} else if (command === 'content') {
	message.channel.send(message.content) //sends the contents of your message

} else if (command === 'play') {
	var voiceChannel = message.member.voice.channel; //plays music from a url, if no url is supplied i will rickroll you.
	if (!voiceChannel) {
		message.channel.send('You need to join a channel first!')
		return	
	}
	var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	if (!args[0]) {
		voiceChannel.join().then(connection =>{
			const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'));
			message.channel.send(`Get rickroll'd`)
		});
		return
	} else if(!regex .test(args[0])) {
	  message.channel.send("Please enter valid URL.");
	  return
	}
	voiceChannel.join().then(connection =>{
		const dispatcher = connection.play(ytdl(args[0]));
		message.channel.send(`Playing \`${args[0]}\``)
		dispatcher.on("end", end => {
		voiceChannel.leave();
		});
	});

} else if (command === 'leave' || command === 'fuckoff') {
	var voiceChannel = message.member.voice.channel; //leaves voice channel
	if (!voiceChannel) {
		message.channel.send('Join my channel, then try again')
		return
	}
	voiceChannel.leave()
	message.channel.send('Left your vc')

} else if (command === 'join') {
	var voiceChannel = message.member.voice.channel; //joins voice channel
	if (!voiceChannel) {
		message.channel.send(`You are not in a vc, join one and try again!`)
		return
	}
	voiceChannel.join()
	message.channel.send('Joined your vc')
} else if (command === 'ip') {
	const ipembed = new Discord.MessageEmbed() //sends server ip
		.setTitle(`IP and Port`)
		.setColor('RANDOM')
		.addFields(
			{ name: 'IP:', value: 'mckineticsmp.com' },
			{ name: 'Port:', value: '25565' },
		)
	message.channel.send(ipembed)
} else if (command === 'thiscommandliterallydoesnothing') { //nothing
	return
} else if (command === 'fact') {
	let factsettings = { method: "Get" };
	let facturl = 'https://uselessfacts.jsph.pl/random.json?language=en' //fact api, random fact
	fetch(facturl, factsettings)
		.then(res => res.json())
		.then((json) => {
			const factembed = new Discord.MessageEmbed()
			.setTitle('Random Fact')
			.setDescription(json.text.replace('`', "'"))
			.setFooter('From djtech.net')
			.setColor('RANDOM')
			message.channel.send(factembed)
		})
		.catch(err => {
			console.log(err)
			fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
			message.channel.send('There was an error completing your request, try again later!')
		})
		
} else if (command === 'meme') {
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
} else if (command === 'joke') {
	let jokesettings = { method: "Get"}
	let jokeurl = 'https://official-joke-api.appspot.com/random_joke' //random joke api
	fetch(jokeurl, jokesettings)
		.then(res => res.json())
		.then((json) => {
			const jokeembed = new Discord.MessageEmbed()
			.setTitle(json.setup)
			.setDescription(json.punchline)
			.setColor('RANDOM')
			message.channel.send(jokeembed)
		})
		.catch(err => {
			console.log(err)
			fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
			message.channel.send('There was an error completing your request, try again later!')
		})
} else if (command === 'randomreddit') {
	if (!args.length) {
		message.channel.send('You need to specify a subreddit without the r/, for example, "dankmemes"')
		return
	}
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
					fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
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
				fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
				message.channel.send(`Error sending embed, something must be too long, check out the post yourself here: <https://reddit.com${post.data.permalink}>`)
			});	
			}
		})
		.catch(err => {
			console.log(err)
			fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
			message.channel.send('There was an error completing your request, did you spell the subreddit right?')
		});
			
} else if (command === 'insult') {
	let insultsettings = { method: "Get"}
	let insulturl = 'https://insult.mattbas.org/api/insult.json' //insult api
	fetch(insulturl, insultsettings)
		.then(res => res.json())
		.then((json) => {
			message.channel.send(json.insult)
		})
		.catch(err => {
			console.log(err)
			fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
			message.channel.send('There was an error completing your request, try again later!')
		});
} else if (command === 'yomama') {
	let yomamasettings = { method: "Get"}
	let yomamaurl = 'https://api.yomomma.info/' //yo mama api
	fetch(yomamaurl, yomamasettings)
		.then(res => res.json())
		.then((json) => {
			message.channel.send(json.joke)
		})
		.catch(err => {
			console.log(err)
			fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
			message.channel.send('There was an error completing your request, try again later!')
		})
} else if (command === 'block') {
	if(message.author.id !== ownerid) return(message.channel.send('Only the bot owner can block people on my behalf')) //make the bot ignore people, just dont block urself lol
	if(!message.mentions.users.first()) return(message.channel.send('You need to mention someone to block!'))
	let data = JSON.parse(fs.readFileSync('blocked.json'))
	if(data.blocked.includes(message.mentions.users.first().id)) return(message.channel.send('That person is already blocked.'))
	data.blocked.push(message.mentions.users.first().id)
	fs.writeFileSync('blocked.json', JSON.stringify(data))
	message.channel.send(`Successfully blocked ${message.mentions.users.first().tag}.`)

} else if (command === 'unblock') {
	if(message.author.id !== ownerid) return(message.channel.send('Only the bot owner can unblock people on my behalf')) //unblocks people, if you block urself you cant unblock urself unless you delete ur id from the file blocked.json
	if(!message.mentions.users.first()) return(message.channel.send('You need to mention someone to unblock!'))
	let data = JSON.parse(fs.readFileSync('blocked.json'))
	if(!data.blocked.includes(message.mentions.users.first().id)) return(message.channel.send('That person is not blocked.'))
	removeFromArray(data.blocked, message.mentions.users.first().id)
	fs.writeFileSync('blocked.json', JSON.stringify(data))
	message.channel.send(`Successfully unblocked ${message.mentions.users.first().tag}.`)
} else if (command === 'google') {
	if (!args.length) return(message.channel.send('What do you want me to google?')) //it would google things, but im too lazy to program that in
	let googlespace = message.content.replace(`${prefix}google `, "")
	let googlenospace = googlespace.replace(` ` , "%20")
	message.channel.send(`https://lmgtfy.app/?q=${googlenospace}`)
} else if (command === 'mcping') {
	let pingme = 'mckineticsmp.com'
	if(args.length) {
		pingme = args[0]
	}
	util.status(pingme) //pings a minecraft server
		.then((response) => {
			const mcpingembed = new Discord.MessageEmbed()
			.setTitle(pingme)
			.setDescription(`**Online players:** ${response.onlinePlayers}/${response.maxPlayers}\n**Server version:** ${response.version}\n**Latency:** ${response.roundTripLatency}ms\n**Motd:** ${response.description.descriptionText}`)
			.setThumbnail('https://i.imgur.com/UWhnOZO.png')
			.setColor('#0ffc03')
			message.channel.send(mcpingembed).catch((err) => {
				console.log(err)
				fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
				message.channel.send('Error sending embed')
			})
		})
		.catch((error) => {
			console.log(error)
			fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(error)}\n`) //stuff to do if it wont get a response
			const mcpingembed = new Discord.MessageEmbed()
			.setTitle('mckineticsmp.com')
			.setDescription(`**Online players:** server offline\n**Server version:** server offline\n**Latency:** server offline\n**Motd:** server offline`)
			.setThumbnail('https://www.freepnglogos.com/uploads/warning-sign-png/warning-sign-red-png-17.png')
			.setColor('#fc0303')
			message.channel.send(mcpingembed).catch((err) => {
				console.log(err)
				fs.appendFileSync('errorlogs/' + mm + '.' + dd + '.' + yyyy + '.txt', `${toString(err)}\n`)
				message.channel.send('Error sending embed.')
			})
		})
} else if (command === 'hibernate') {
	if(message.author.id !== ownerid) return(message.channel.send('Only the bot owner can make me hibernate.')) //sleepy boi
	message.channel.send('Goodbye!')
	Hibernate(client);
} else if (command === 'thiscommandmightdosomething') {
	message.channel.send('That command may or may not have done something.')
} else if (command === 'save') {
	if(message.author.id !== ownerid) return(message.channel.send('Only the bot owner can save files to my hard drive.')) //lets save some files
	if(!message.attachments.length) return(message.channel.send('You have to attatch a file to save!'))
	fetch(message.attachments.first().url)
	.then(res => {
 	 const dest = fs.createWriteStream(`./saved/${mm}.${dd}.${yyyy}${message.attachments.first().name}`);
  	res.body.pipe(dest);
	});
} else if (command === 'paradox') {
	message.channel.send('The next sentence is false.\nThe previous sentence is true')
} else if (command === 'doge') {
	got('https://sochain.com/api/v2/get_price/DOGE/USD') //get that dogecoin
	.then(response => {
		let data = JSON.parse(response.body)
		const dogeembed = new Discord.MessageEmbed()
		.setTitle('Dogecoin Data')
		.setURL('https://www.coindesk.com/price/dogecoin')
		.setColor('RANDOM')
		.setDescription(`Dogecoin is selling at Gemini for ${data.data.prices[0].price} USD\n\nDogecoin is selling at Binance for ${data.data.prices[1].price} USD`)
		message.channel.send(dogeembed)
	})
}

});

client.on('message', message => {
if(isHibernating){ return(false) } //Bot is Hibernating
let blocked = JSON.parse(fs.readFileSync('blocked.json'))
if(blocked.blocked.includes(message.author.id)) return
let ignoreautoresponse = JSON.parse(fs.readFileSync('config.json'))
if(ignoreautoresponse.autoresponseignore.includes(message.author.id)) return
if(message.webhookID) return;
if(message.author.presence.status === 'offline') { //checks if author is offline
 if(message.author.bot) return //if author is bot, forget them
 var calloutoffline = Math.random() < 0.1; //rolls a 10 sided die
 if(calloutoffline === true) { //if said die lands on 10, continue
	let ignorecallout = JSON.parse(fs.readFileSync('config.json'))
	if(ignorecallout.ignoreofflinecallout.includes(message.author.id)) return
	message.channel.send(`HEY EVERYONE! <@${message.author.id}> IS TRYING TO BE SNEAKY AND CHAT WHILE THEY ARE OFFLINE!`) //call out the coward
	}
}
if (message.author.id === botid) return
if (message.guild === null) return
if (message.content.includes('poll2op')) { //poll with 2 options
	message.react('1️⃣')
	message.react('2️⃣')
} else if (message.content.includes('poll3op')) { //poll with 3 options
	message.react('1️⃣')
	message.react('2️⃣')
	message.react('3️⃣')
} else if (message.content.includes('poll4op')) { //poll with 4 options
	message.react('1️⃣')
	message.react('2️⃣')
	message.react('3️⃣')
	message.react('4️⃣')
} else if (message.content === 'f') { //f
	message.channel.send('f')
} else if (message.content.includes('oof')) { //oof
	message.channel.send('oof')
} else if (message.content.includes('minecraft')) { //minecraft is good
	message.channel.send('gud')
} else if (message.content.includes('hehe')) { //hehehe
	message.channel.send('hehehe')
} else if (message.content.includes('smae')) { //its spelled 'same'
	message.channel.send('*same')
} else if (message.content.includes('giu')) { //cutie giu
	message.channel.send('is cute')
} else if (message.content.includes('pollyn')) { //poll yes or no
	message.react('🇾')
	message.react('🇳')
} else if (message.content.includes('stfu') || message.content.includes('Stfu')) { //i will not shut up
	message.channel.send('no u')
} else if (message.content.includes('pollupdown')) { //poll upvote/downvote
	message.react('👍')
	message.react('👎')
} else if (message.content.includes('doge') || message.content.includes('dogecoin')) { //dogecoin woo
	got('https://sochain.com/api/v2/get_price/DOGE/USD')
	.then(response => {
		let data = JSON.parse(response.body)
		const dogeembed = new Discord.MessageEmbed()
		.setTitle('Dogecoin Data')
		.setURL('https://www.coindesk.com/price/dogecoin')
		.setColor('RANDOM')
		.setDescription(`Dogecoin is selling at Gemini for ${data.data.prices[0].price} USD\n\nDogecoin is selling at Binance for ${data.data.prices[1].price} USD`)
		message.channel.send(dogeembed)
	})
}

});

client.login(token); //login
