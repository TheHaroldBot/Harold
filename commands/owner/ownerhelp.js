const Discord = require('discord.js');

module.exports = {
	name: 'ownerhelp', //command name
	description: 'Help command for the bot owner(s)', //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: 1, //cooldown in seconds, defaults to 3
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: ['ownercommands'],
	execute(message, args, prefix) { //inside here command stuff
		const ownerembed = new Discord.MessageEmbed()
		.setTitle('Owner Help Menu')
		.setColor('RANDOM')
		.setDescription('**setstatus** - sets the bot presence\n**setavatar** - sets the bot avatar\n**setgame** - sets the game the bot is playing\n**log** - logs information to the console\n**shutdown** - shuts down the bot\n**ownerhelp** - displays this embed\n**setstream** <url> <name> - sets a streaming status\n**block** - make the bot ignore someone\n**unblock** - make the bot resume working for someone\n**hibernate** - makes the bot go into low-power mode\n**hibernate_off** - turns off hibernate and enables normal bot functions\n**reload** <command/alias> - reloads a command after code changes')
		message.react('📬')
		message.author.send ({ embeds: [ownerembed]})
	},
};