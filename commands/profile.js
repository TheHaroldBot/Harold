const Discord = require('discord.js');

module.exports = {
	name: 'profile', // command name
	description: 'Gets a user\'s profile information.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	aliases: ['pfp', 'profileimage', 'whois'],
	async execute(message) { // inside here command stuff.
		let pfptarget;
		if (!message.mentions.users.first()) {
			pfptarget = await message.author.fetch({ force: true });
		}
		else {
			pfptarget = await message.mentions.users.first().fetch({ force: true });
		}
		const accountCreated = Math.round(pfptarget.createdAt / 1000);
		const pfpembed = new Discord.MessageEmbed()
			.setAuthor('Details provided by Harold, recorded by Discord', 'https://i.imgur.com/lOT690e.png', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
			.setColor('RANDOM')
			.setTitle('Profile info')
			.setDescription(`**Name:** ${pfptarget.tag}\n**ID:** ${pfptarget.id}\n**Bot:** ${pfptarget.bot}\n**System:** ${pfptarget.system}\n**Partial:** ${pfptarget.partial}\n**Flags:** ${pfptarget.flags.toArray().join(', ').replace('_', ' ')}\n**Created on:** <t:${accountCreated}:D> at <t:${accountCreated}:t> (Translated into your time zone)\n**Accent color:** ${pfptarget.hexAccentColor}\n**Avatar ID:** ${pfptarget.avatar}\n**Avatar URL:** [Link↗](${pfptarget.avatarURL()})\n**Default avatar URL:** [Link↗](${pfptarget.defaultAvatarURL})`)
			.setThumbnail(pfptarget.avatarURL({ dynamic: true, size: 512 }))
			.setTimestamp();
		if (message.guild !== null) {
			const guildMember = message.guild.members.cache.find(user => user.id === pfptarget.id);
			const joinedGuild = Math.round(guildMember.joinedTimestamp / 1000);
			pfpembed.addField('Server-specific information', `**Joined on: ** <t:${joinedGuild}:D> at <t:${joinedGuild}:t> (Translated into your time zone)\n**Display name:** ${guildMember.displayName}\n**Display color:** ${guildMember.displayHexColor}\n**Pending membership:** ${guildMember.pending}\n**Kickable:** ${guildMember.kickable}\n**Bannable:** ${guildMember.bannable}`);
		}
		message.reply({ embeds: [pfpembed] });
	},
};
