const Discord = require('discord.js');
const { TIMEOUT } = require('dns');
const fetch = require('node-fetch');
const client = new Discord.Client();
const { token, ownerid } = require('./config.json');
const prefix = "/"

client.once('ready', () => {
	console.log('Ready!\n');
	client.channels.cache.get('802206642745507840').send('I have woken');
});

client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
   if(message.guild === null) {
	  console.log(`DM From: ${message.author.tag} > ${message.content}`)
	  if(message.content.startsWith(prefix)) {
		  message.author.send('Commands can only be run from a server, not a dm.')
	  }
	  return
  } else {
	  console.log(`From: ${message.author.tag} > ${message.content}`)
  }
  if(message.author.bot) return
 
  if (message.content === '/ping') {
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
		{ name: 'Commands:', value: '**help** - displays this embed\n**echo** - echos what you write\n**delete** - deletes your message\n**serverinfo** - displays connection info along with the status and dynmap\n**count** - displays member count\n**userinfo** - displays username and id\n**slowmode** - sets slowmode to specified seconds' },
		{ name: 'Abilities:', value: 'Hating Nubia'}
	)
  message.channel.send(helpembed)
} else if (command === "debug") {
	const debugembed = new Discord.MessageEmbed()
	.setColor('#21B8FF')
	.setTitle('Debugging')
	.addFields(
		{ name: 'Commands:', value: '**args** - sends the arguments in your message\n**argsinfo** - sends command and arguments\n**shutdown** - shuts down the bot'}
	)
	message.channel.send(debugembed);
} else if (command === 'spam') {
  if (!args.length) {
  		return message.channel.send('u didnt say what to spam')
  }
  const spam = args[0]
  message.delete()
  message.channel.send(message.content.replace("/spam", ""));
  message.channel.send(message.content.replace("/spam", ""));
  message.channel.send(message.content.replace("/spam", ""));
  message.channel.send(message.content.replace("/spam", ""));
  message.channel.send(message.content.replace("/spam", ""));
} else if (command === 'delete') {
	message.delete()
} else if (command === 'echo') {
	if (!args.length) {
		return message.channel.send('you didnt say anything to echo')
	}
	message.delete()
	message.channel.send(message.content.replace("/echo", ""));
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
		{ name: 'Commands:', value: 'do /help' },
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
		console.log('\x1b[32m\x1b[4m\x1b[1m%s', `Custom log: ${message.content.replace("/log ", "")}`);
		message.channel.send('Message logged!')
	}
} else if (command === 'game') {
	if (!args.length) {
		message.channel.send ('you need to name a status')
	} else if (message.author.id !== ownerid) {
		return message.channel.send ('Only the bot owner can change my status.')
	} else {
		client.user.setActivity(message.content.replace("/game ", ""))
		message.channel.send(`Status set to ${message.content.replace("/game ", "")}`)
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
} else if (command === 'presence') {
	if (!args.length) {
		message.channel.send ('You need to provide a presence. Allowed values are:\nonline, idle, invisible, dnd')
	} else if (message.author.id !== ownerid) {
		return message.channel.send('Only the owner can change my presence')
	} else if (args[0] === 'online') {
		client.user.setPresence({ status: 'online' })
		message.channel.send(`Presence set to ${args[0]}`)
	} else if (args[0] === 'idle') {
		client.user.setPresence({ status: 'idle' })
		message.channel.send(`Presence set to ${args[0]}`)
	} else if (args[0] === 'invisible') {
		client.user.setPresence({ status: 'invisible' })
		message.channel.send(`Presence set to ${args[0]}`)
	} else if (args[0] === 'dnd') {
		client.user.setPresence({ status: 'dnd' })
		message.channel.send(`Presence set to ${args[0]}`)
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
		.setDescription('**presence** - sets the bot presence\n**setavatar** - sets the bot avatar\n**game** - sets the game the bot is playing\n**log** - logs information to the console\n**shutdown** - shuts down the bot\n**ownerhelp** - displays this embed')
		message.channel.send (ownerembed)
	}
}

});

client.login(token);