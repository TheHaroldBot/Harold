const Discord = require('discord.js');

module.exports = {
	name: 'profile', //command name
	description: "Gets a user's profile information.", //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	aliases: ['pfp', 'profileimage', 'whois'],
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
        .setDescription(`**Name:** ${pfptarget.tag}\n**ID:** ${pfptarget.id}\n**Bot:** ${pfptarget.bot}\n**System:** ${pfptarget.system}\n**Partial:** ${pfptarget.partial}\n**Flags:** ${pfptarget.flags.toArray().join(', ').replace('_', ' ')}\n**Created at:** ${pfptarget.createdAt}\n**Avatar ID:** ${pfptarget.avatar}\n**Avatar URL:** [Link↗](${pfptarget.avatarURL()})\n**Default avatar URL:** [Link↗](${pfptarget.defaultAvatarURL})`)
        .setThumbnail(pfptarget.avatarURL({ dynamic: true, size: 512}))
        .setTimestamp()
        if(message.guild !== null) {
            let guildMember = message.guild.members.cache.find(user => user.id === pfptarget.id)
            let joinedGuild = Math.round(guildMember.joinedTimestamp / 1000)
            pfpembed.addField('Server information', `**Joined on: ** <t:${joinedGuild}:D> at <t:${joinedGuild}:t> (Translated into your time zone)\n**Nickname:** ${guildMember.displayName}\n**Pending membership:** ${guildMember.pending}`)
        }
        message.reply({ embeds: [pfpembed]})
	},
};
