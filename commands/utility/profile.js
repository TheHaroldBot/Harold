const Discord = require('discord.js');

module.exports = {
	name: 'profile', //command name
	description: "Gets a user profile picture.", //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	aliases: ['pfp', 'profileimage'],
    execute(message, args, prefix) { //inside here command stuff.
        let pfptarget
        if (!message.mentions.users.first()) {
            pfptarget = message.author
        } else {
            pfptarget = message.mentions.users.first()
        }
        const pfpembed = new Discord.MessageEmbed()
        .setAuthor('Details provided by Harold, recorded by Discord', 'https://i.imgur.com/lOT690e.png', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
        .setColor('RANDOM')
        .setTitle(`Profile info`)
        .setDescription(`**Name:** ${pfptarget.tag}\n**ID:** ${pfptarget.id}\n**Bot:** ${pfptarget.bot}\n**System:** ${pfptarget.system}\n**Partial:** ${pfptarget.partial}\n**Avatar ID:** ${pfptarget.avatar}\n**Created at:** ${pfptarget.createdAt}\n**Default avatar URL:** [Link↗](${pfptarget.defaultAvatarURL})`)
        .setThumbnail(pfptarget.avatarURL(/* { dynamic: true, size: 256} */))
        .setTimestamp()
        message.channel.send({ embeds: [pfpembed]})
	},
};