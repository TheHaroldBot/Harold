const Discord = require('discord.js');
const client = new Discord.Client();
const { token, ownerid } = require('./config.json');
const prefix = "/"
var hate = "743196563182059572"

client.once('ready', () => {
	console.log('Ready!\n');
	client.channels.cache.get('802206642745507840').send('I have woken');
});

client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  console.log(`From: ${message.author.tag} > ${message.content}`)
  if(message.author.bot) return
  if(message.guild === null) return
if (message.content === '/ping') {
	message.channel.send('Pong.');
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
		{ name: 'Commands:', value: '**help** - displays this embed\n**echo** - echos first word typed after command\n**delete** - deletes your message\n**serverinfo** - displays connection info along with the status and dynmap\n**count** - displays member count\n**userinfo** - displays username and id' },
		{ name: 'Abilities:', value: 'Hating Nubia'},
		{ name: 'Debugging:', value: '**args** - sends the arguments in your message\n**argsinfo** - sends command and arguments\n**shutdown** - shuts down the bot'}
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
		message.channel.send("Sorry! Only the bot owner can do that.")
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
} 

});

client.login(token);
