const Discord = require('discord.js');

module.exports = {
	name: 'shutdown', //command name
	description: "Shuts down the bot.", //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
        process.exit()
	},
};