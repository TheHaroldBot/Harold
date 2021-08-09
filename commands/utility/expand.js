const Discord = require('discord.js');
var { tall } = require('tall')

module.exports = {
	name: 'expand', //command name
	description: 'Expand a URL', //command description
	args: true, //needs arguments? delete line if no
    usage: `<url>`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
	aliases: ['urlexpand'],
	execute(message, args, prefix) { //inside here command stuff
		tall(args[0])
        .then(unshortenedUrl => message.reply(`Expanded URL: ${unshortenedUrl}`))
	},
};