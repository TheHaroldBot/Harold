const Discord = require('discord.js');

module.exports = {
	name: 'join', //command name
	description: 'Makes the bot join your voice channel.', //command description
    usage: ``, //usage instructions w/o command name and prefix
    guildOnly: true, //execute in a guild only? remove line if no
	cooldown: 5, //cooldown in seconds, defaults to 3
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
		var voiceChannel = message.member.voice.channel; //joins voice channel
	        if (!voiceChannel) {
	        	message.channel.send(`You are not in a vc, join one and try again!`)
	        	return
	        }
	        voiceChannel.join()
	        message.channel.send('Joined your vc')
	},
};