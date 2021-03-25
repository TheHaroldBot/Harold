const Discord = require('discord.js');
const Webhook = require('discord.js');
const path = require("path")
const fs = require("fs")
const ytdl = require("ytdl-core")
const { TIMEOUT } = require('dns');
const fetch = require('node-fetch');
const client = new Discord.Client();
const reportwebhook = new Discord.WebhookClient('809818709144633415', 'JW8sEYjgkYlG7pbg0Go4jb4-HYI6OgyRzh__OB4ZP2cNlsFnQ1dRn-uqCfaVmX0OsNG-')
const suggestionwebhook = new Discord.WebhookClient('824303438292582451', 'Ux76_IeqplB1IQdBSPrS7iQ5Wzalpfn1iP3-H78UKbNt-AQsAXVGmDf__1aTQA3jg2C7')
const { token, ownerid, webhookurl } = require('./config.json');
const prefix = "*"

client.once('ready', () => {
	console.log('Ready!\n');
});

client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
   if(message.webhookID) return;
   if(message.guild === null) {
	  console.log('\x1b[0m', `DM From: ${message.author.tag} > ${message.content}`)
	  if(message.content.startsWith(prefix)) {
		  message.author.send('Commands can only be run from a server, not a dm.')
	  }
	  return
  } else {
	  console.log(`From: ${message.author.tag} > ${message.content}`)
  }
  if(!message.content.startsWith(prefix)) return
  if(message.author.bot) return
  if (message.content === `${prefix}ping`) {
	message.channel.send(`🏓 API Latency is ${Math.round(client.ws.ping)}ms`);
} else if (message.content === `${prefix}count`) {
	message.channel.send(`Current member count: ${message.guild.memberCount}`);
} else if (message.content === `${prefix}userinfo`) {
	message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
} else if (command === 'argsinfo') {
	if (!args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}
	message.channel.send(`Command name: ${command}\nArguments: ${args}`);
} else if (command === 'args') {
  message.channel.send(args)
} else if (command === 'help') {
	const helpembed = new Discord.MessageEmbed()
	.setColor('#21B8FF')
	.setTitle('Help Page')
	.addFields(
		{ name: 'Commands:', value: '**help** - displays this embed\n**echo** - echos what you write\n**delete** - deletes your message\n**serverinfo** - displays connection info along with the status and dynmap\n**count** - displays member count\n**userinfo** - displays username and id\n**slowmode** - sets slowmode to specified seconds\n**yesorno** - chooses random, either "yes" or "no"\n**rules** - displays server rules\n**report** - reports something/someone, it will report anything written after the command\n**guildicon** - sends the guilds icon\n**ping** - gets api latency\n**suggest** - Sends a suggestion to the suggestions channel\n**play <youtube link>** - plays a song\n**leave** - makes the bot leave your vc\n**join** - makes the bot join your vc'}
	)
  message.channel.send(helpembed)
} else if (command === "debug") {
	const debugembed = new Discord.MessageEmbed()
	.setColor('#21B8FF')
	.setTitle('Debugging')
	.addFields(
		{ name: 'Commands:', value: '**args** - sends the arguments in your message\n**argsinfo** - sends command and arguments\n**shutdown** - shuts down the bot\n**content** - sends the contents of a message'}
	)
	message.react('📬')
	message.author.send(debugembed);
} else if (command === 'spam') {
  if (!args.length) {
  		return message.channel.send('u didnt say what to spam')
  }
  const spam = args[0]
  message.delete()
  message.channel.send(message.content.replace(`${prefix}spam`, ""));
  message.channel.send(message.content.replace(`${prefix}spam`, ""));
  message.channel.send(message.content.replace(`${prefix}spam`, ""));
  message.channel.send(message.content.replace(`${prefix}spam`, ""));
  message.channel.send(message.content.replace(`${prefix}spam`, ""));
} else if (command === 'delete') {
	message.delete()
} else if (command === 'echo') {
	if (!args.length) {
		return message.channel.send('you didnt say anything to echo')
	}
	message.delete()
	message.channel.send(message.content.replace(`${prefix}echo`, ""));
} else if (command === 'serverinfo') {
  const serverinfoembed = new Discord.MessageEmbed()
	.setColor('#21B8FF')
	.setTitle('Connection and Status Info')
	.addFields(
		{ name: 'IP:', value: 'kineticsmp.ddns.net' },
		{ name: 'Port:', value: '25565' },
		{ name: 'Check Status in Discord:', value: '<#802204876514787338>' },
		{ name: 'Check Status Online:', value: 'https://kineticsmp.ddns.net:8000' },
		{ name: 'Dynmap:', value: 'http://kineticsmp.ddns.net:8123/' }
	)
  message.channel.send(serverinfoembed)
} else if (command === 'intro') {
	const introembed = new Discord.MessageEmbed()
	.setColor('#21B8FF')
	.setTitle('Intro')
	.addFields(
		{ name: 'Hello!', value: 'Thank you for adding me!'},
		{ name: 'Name:', value: 'Kinetic SMP Bot' },
		{ name: 'Purpose:', value: 'General Kinetic SMP stuff, and annoying Nubia' },
		{ name: 'Commands:', value: `do ${prefix}help` },
		{ name: 'Things to know:', value: 'I am in beta, and will sometimes do stuff that isnt supposed to happen.'},
		{ name: 'Github:', value: 'https://github.com/johng3587/KineticSMPBot'}
	)
	message.delete()
	message.channel.send(introembed)
} else if (command === 'shutdown') {
	if(message.author.id !== ownerid) {
		return message.channel.send("Sorry! Only the bot owner can do that.")
	} else {
		client.destroy()
	}
} else if (command === 'invite') {
	message.channel.send("https://discord.gg/dRmgSzhbVt")
} else if (command === 'github') {
	const githubembed = new Discord.MessageEmbed()
	.setColor('#21B8FF')
	.setTitle('Github')
	.setDescription('https://github.com/johng3587/KineticSMPBot')
	message.channel.send (githubembed)
} else if (command === 'slowmode') {
	if (!args.length) {
		 return message.channel.send('you didnt say a slowmode time')
	} else if (!message.member.hasPermission('MANAGE_CHANNELS')) {
		return message.channel.send ('you dont have permission to do that')
	} else {
		message.channel.setRateLimitPerUser(args[0], `${message.author.tag} requested a slowmode of ${args[0]} seconds.`)
		message.channel.send(`Success! Slowmode set to ${args[0]} seconds.`)
	}
} else if (command === 'log') {
	if (!args.length) {
		return message.channel.send('You didnt say anything to log!')
	} else if (message.author.id !== ownerid) {
		return message.channel.send ('Only the bot owner can log messages to the console.')
	} else {
		const logcontent = message.content
		console.log('\x1b[32m\x1b[4m\x1b[1m%s', `Custom log: ${message.content.replace(`${prefix}log `, "")}`);
		message.channel.send('Message logged!')
	}
} else if (command === 'setgame') {
	if (!args.length) {
		message.channel.send ('you need to name a status')
	} else if (message.author.id !== ownerid) {
		return message.channel.send ('Only the bot owner can change my status.')
	} else {
		client.user.setActivity(message.content.replace(`${prefix}setgame `, ""))
		message.channel.send(`Game set to ${message.content.replace(`${prefix}setgame `, "")}`)
	}
	 
} else if (command === 'setavatar') {
	if (!args.length) {
		message.channel.send ('you need to rovide a url')
	} else if (message.author.id !== ownerid) {
		return message.channel.send ('Only the owner can change my profile picture')
	} else {
		client.user.setAvatar(args[0])
		message.channel.send('Avatar changed')
	}
} else if (command === 'setstatus') {
	if (!args.length) {
		message.channel.send ('You need to provide a status. Allowed values are:\nonline, idle, invisible, dnd')
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
		return message.channel.send ('Only the bot owner can access this command.')
	} else {
		const ownerembed = new Discord.MessageEmbed()
		.setTitle('Owner Help Menu')
		.setColor('#21B8FF')
		.setDescription('**setstatus** - sets the bot presence\n**setavatar** - sets the bot avatar\n**setgame** - sets the game the bot is playing\n**log** - logs information to the console\n**shutdown** - shuts down the bot\n**ownerhelp** - displays this embed\n**setstream** <url> <name> - sets a streaming status')
		message.channel.send (ownerembed)
	}
} else if (command === 'yesorno') {
	const yesorno = (Math.random() < 0.5);
	if (yesorno === true) {
		message.channel.send ('Yes')
	} else {
		message.channel.send ('No')
	}

} else if (command === 'rules') {
		const rulesembed = new Discord.MessageEmbed()
		.setTitle('Rules of Kinetic SMP')
		.setColor('#21B8FF')
		.setDescription(`- No hacking
		- No greifing
		- No lagging intentionally
		- Ask before pvping
		- No stealing
		- No raiding people
		- No asking staff for items, or asking staff to do something for you
		- Personal buildings, i.e. houses, should be build at least 200 blocks from spawn
		- If you leave discord, i remove you from the whitelist.
		- No 3rd party clients allowed, unless approved by a staff member. Yes, optifine, lunar, badlion are ok.
		- No speaking negatively about other players
		- Ask staff before fighting the ender dragon again
		- No xraying
		- You may enter another person's property (claimed land) but they may ask you to leave and/or refuse service, if they ask you to, you are required to leave.
		- You must ask for someone's head before you kill them.`)
		message.channel.send (rulesembed)

} else if (command === 'profile') {
	if ((!message.member.hasPermission('ADMINISTRATOR'))) {
		message.channel.send('Only users with the ADMINISTRATOR permission can do that')
	} else if (!args.length) {
		const pfptarget = message.author
		const pfpembed = new Discord.MessageEmbed()
		.setColor('#21B8FF')
		.setTitle(`Profile Image for: ${pfptarget.username}`)
		.setImage(pfptarget.avatarURL({ dynamic: true, size: 256}))
		message.channel.send(pfpembed)
	} else {
		const pfptarget = message.mentions.users.first()
		const pfpembed = new Discord.MessageEmbed()
		.setColor('#21B8FF')
		.setTitle(`Profile Image for: ${pfptarget.username}`)
		.setImage(pfptarget.avatarURL({ dynamic: true, size: 256}))
		message.channel.send(pfpembed)
	}
} else if (command === 'report') {
	if (!args.length) {
		message.delete()
		message.author.send('you need to say something to report')
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
	.setColor('#21B8FF')
	.setTitle(`Guild icon for: ${message.guild.name}`)
	.setImage(message.guild.iconURL({ dynamic: true, size: 256}))
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
		message.channel.send('only the bot owner can do that')
		return
	} else if (args.length <= 2) {
		message.channel.send('you need to set a stream title *and* a url')
		return
	} else {
		client.user.setActivity(message.content.replace(`${prefix}setstream ${args[0]}`, ""), {
			type: "STREAMING",
			url: args[0]
		  });
		  message.channel.send(`Streaming ${message.content.replace(`${prefix}setstream ${args[0]}`, "")} at ${args[0]}`)
	}
} else if (command === 'suggest') {
	if (!args.length) {
		message.delete()
		message.author.send('you need to say something to report')
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
	message.channel.send(message.content)

} else if (command === 'play') {
	var voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.channel.send('You need to join a channel first!')
		return	
	}
	var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	if (!args[0]) {
		voiceChannel.join().then(connection =>{
			const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'));
		});
		return
	} else if(!regex .test(args[0])) {
	  message.channel.send("Please enter valid URL.");
	}
	voiceChannel.join().then(connection =>{
		const dispatcher = connection.play(ytdl(args[0]));
		message.channel.send(`Playing \`${args[0]}\``)
		dispatcher.on("end", end => {
		voiceChannel.leave();
		});
	});

} else if (command === 'leave') {
	var voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.channel.send('Join my channel, then try again')
		return
	}
	voiceChannel.leave()
	message.channel.send('Left your vc')

} else if (command === 'join') {
	var voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.channel.send(`You are not in a vc, join one and try again!`)
		return
	}
	voiceChannel.join()
	message.channel.send('Joined your vc')
} else if (command === 'skip') {
	skip(message, serverQueue);
    return;
}

});

client.on('message', message => {
if(message.author.bot) return
if (message.content.includes('poll2op')) {
	message.react('1️⃣')
	message.react('2️⃣')
} else if (message.content.includes('poll3op')) {
	message.react('1️⃣')
	message.react('2️⃣')
	message.react('3️⃣')
} else if (message.content.includes('poll4op')) {
	message.react('1️⃣')
	message.react('2️⃣')
	message.react('3️⃣')
	message.react('4️⃣')
} else if (message.content.includes('cacti' || 'cactus' || 'owner')) {
	message.channel.send('Cacti is the great one, always and forever')
} else if (message.content === 'f') {
	message.channel.send('**f**')
}

});

client.login(token);