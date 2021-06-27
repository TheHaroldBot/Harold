const Discord = require('discord.js');

module.exports = {
	name: 'leave', //command name
	description: 'Makes the bot leave your voice channel.', //command description
    usage: ``, //usage instructions w/o command name and prefix
    guildOnly: true, //execute in a guild only? remove line if no
	cooldown: 5, //cooldown in seconds, defaults to 3
	aliases: ['begone', 'fuckoff'],
	execute(message, args, prefix) { //inside here command stuff
		var voiceChannel = message.member.voice.channel; //leaves voice channel
        	if (!voiceChannel) {
	        	message.channel.send('Join my channel, then try again')
	        	return
	        }
	        voiceChannel.leave()
	        message.channel.send('Left your vc')
	},
};