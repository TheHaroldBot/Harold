const Discord = require('discord.js');

module.exports = {
	name: 'leaveguild', //command name
	description: 'Leaves the server.', //command description
    usage: ``, //usage instructions w/o command name and prefix
    guildOnly: true, //execute in a guild only? remove line if no
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: ['MANAGE_WEBHOOKS', 'MANAGE_SERVER', 'KICK_MEMBERS'], //permissions required for command
	aliases: ['leaveserver'],
	execute(message, args, prefix) { //inside here command stuff
		message.channel.send('Bye!')
		console.log(`Leaving ${message.guild.name}`)
        message.guild.leave()
	},
};