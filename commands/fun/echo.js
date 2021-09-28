const Discord = require('discord.js');

module.exports = {
	name: 'echo', //command name
	description: 'Repeats what you say.', //command description
	args: true, //needs arguments? delete line if no
	ownerOnly: true,
    usage: `<message>`, //usage instructions w/o command name and prefix
	cooldown: 1, //cooldown in seconds, defaults to 3
	aliases: ['repeat', 'simonsays'],
	execute(message, args, prefix) { //inside here command stuff
		message.delete()
	    message.channel.send(message.content.replace(`${prefix}echo`, "")); //tells you what you told it
	},
};
