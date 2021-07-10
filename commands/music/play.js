const Discord = require('discord.js');
const ytdl = require("ytdl-core")

module.exports = {
	name: 'play', //command name
	description: 'Play a youtube video in a voice chat', //command description
    usage: `<Youtube video link>`, //usage instructions w/o command name and prefix
    guildOnly: true, //execute in a guild only? remove line if no
	cooldown: 5, //cooldown in seconds, defaults to 3
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
		var voiceChannel = message.member.voice.channel; //plays music from a url, if no url is supplied i will rickroll you.
        	if (!voiceChannel) {
	        	message.channel.send('You need to join a voice channel first!')
	        	return	
        	}
        	var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        	if (!args[0]) {
        		voiceChannel.join().then(connection =>{
        			const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'));
        			message.channel.send(`Get rickroll'd`)
        		});
        		return
        	} else if(!regex .test(args[0])) {
        	  message.channel.send("Please enter valid URL.");
        	  return
	        }
        	voiceChannel.join().then(connection =>{
	        	const dispatcher = connection.play(ytdl(args[0]));
	        	message.channel.send(`Playing \`${args[0]}\``)
	        	dispatcher.on("end", end => {
	        	voiceChannel.leave();
	        	});
	        });
	},
};