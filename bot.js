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
} else if (command === 'arg1') {
  message.channel.send(args[0])
} else if (command === 'args') {
  message.channel.send(args)
} else if (command === 'game-request') {
  if (!args.length) {
    return message.channel.send('u need a game to request')
  }
  const author = message.author.id
  const game = args[0]
  const time = args[1]
	message.delete()
  client.channels.cache.get('801159055090384896').send(`<@&801161860225040384> Game request from: <@${author}>\nGame: ${game}\nTime: ${time}`)
  message.channel.send('sent!')
} else if (command === 'help') {
  message.channel.send('Current Commands:\n**game-request <game> [time]** - request a game (no spaces please)\n**spam <stuff>** - spam specified word 5 times')
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
	message.delete
} else if (command === 'echo') {
	const echo = args[0]
	message.delete
	message.channel.send(echo)
}

});

client.login('ODA4NzUwMjI0MDMzMTg1Nzk0.YCLFVw.sjC0yCxdJBtNdNzveyihvCY_93c');
