const Discord = require('discord.js');

module.exports = {
	name: 'guildicon', //command name
	description: 'Gets the icon for the current server.', //command description
    usage: ``, //usage instructions w/o command name and prefix
    guildOnly: true, //execute in a guild only? remove line if no
	cooldown: 2, //cooldown in seconds, defaults to 3
	aliases: ['guildimage', 'guildpfp', 'guildprofile', 'guildprofileimage', 'servericon', 'serverpfp', 'serverprofile', 'serverprofileimage'],
	execute(message, args, prefix) { //inside here command stuff
		const guildicon = new Discord.MessageEmbed()
    	.setColor('RANDOM')
	    .setTitle(`Guild icon for: ${message.guild.name}`)
	    .setImage(message.guild.iconURL({ dynamic: true, size: 256})) //gets the guild icon
    	message.channel.send({ embeds: [guildicon]})
	},
};