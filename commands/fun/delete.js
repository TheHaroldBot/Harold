const Discord = require('discord.js');

module.exports = {
	name: 'delete', //command name
	description: 'Deletes your message. Nothing more.', //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: 1, //cooldown in seconds, defaults to 3
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
		message.delete()
	},
};