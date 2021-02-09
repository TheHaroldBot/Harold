const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '/'

client.once('ready', () => {
	console.log('Ready!\n');
});

client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
	console.log(`From: ${message.author.tag} > ${message.content}`)

  if (message.content === '/ping') {
	message.channel.send('Pong.');
} else if (message.content === `${prefix}count`) {
	message.channel.send(`Current member count: ${message.guild.memberCount}`);
} else if (message.content === `${prefix}user-info`) {
	message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
} else if (command === 'args-info') {
	if (!args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}
	message.channel.send(`Command name: ${command}\nArguments: ${args}`);
} else if (command === 'args') {
  message.channel.send(args)
} else if (command === 'help') {
  message.channel.send('Current Commands:\n**count** - Counts Discord Members\n**ping** - pong')
} else if (command === 'spam') {
if (!args.length) {
  return message.channel.send('u didnt say what to spam')
  }
  const spam = args[0]
	message.delete()
  message.channel.send(spam)
  message.channel.send(spam)
  message.channel.send(spam)
  message.channel.send(spam)
  message.channel.send(spam)
} else if (command === 'delete') {
	message.delete()
} else if (command === 'echo') {
	const echo = args
	message.delete()
	message.channel.send(echo)
} else if (command === 'ip') {
  const ipEmbed = new Discord.MessageEmbed()
	.setColor('#21B8FF')
	.setTitle('Connection and Status Info')
	.addFields(
		{ name: 'IP:', value: 'kineticsmp.ddns.net' },
		{ name: 'Port:', value: '25565' },
		{ name: 'Check Status in Discord:', value: '<#802204876514787338>' },
		{ name: 'Check Status Online:', value: 'https://kineticsmp.ddns.net:8000' }
	)
  message.channel.send(ipEmbed)
}

});

client.login('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
