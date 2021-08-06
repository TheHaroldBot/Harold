const Discord = require('discord.js');

module.exports = {
	name: 'profile', //command name
	description: "Gets a user profile picture.", //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	aliases: ['pfp', 'profileimage'],
	execute(message, args, prefix) { //inside here command stuff
        if (!args.length) {
            const pfptarget = message.author
            const pfpembed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Profile Image for: ${pfptarget.tag}`)
            .setImage(pfptarget.avatarURL({ dynamic: true, size: 256}))
            message.channel.send(pfpembed)
        } else {
            const pfptarget = message.mentions.users.first()
            const pfpembed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`Profile Image for: ${pfptarget.tag}`)
            .setImage(pfptarget.avatarURL({ dynamic: true, size: 256}))
            message.channel.send(pfpembed)
        }
	},
};