const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	name: 'profile', // command name
	description: 'Gets a user\'s profile information.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: ['pfp', 'profileimage', 'whois', 'userinfo'],
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Gets a user\'s profile information.')
		.addUserOption(option =>
			option.setName('user')
				.setRequired(false)
				.setDescription('The user to get the profile of.')),

	async execute(interaction) { // inside here command stuff.
		let pfptarget;
		if (!interaction.options.getUser('user')) {
			pfptarget = await interaction.user.fetch({ force: true });
		}
		else {
			pfptarget = await interaction.options.getUser('user').fetch({ force: true });
		}
		const accountCreated = Math.round(pfptarget.createdAt / 1000);
		const pfpembed = new Discord.MessageEmbed()
			.setAuthor('Details provided by Harold, recorded by Discord', interaction.client.user.avatarURL(), 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
			.setColor('RANDOM')
			.setTitle('Profile info')
			.setDescription(`**Name:** ${pfptarget.tag}\n**ID:** ${pfptarget.id}\n**Bot:** ${pfptarget.bot}\n**System:** ${pfptarget.system}\n**Partial:** ${pfptarget.partial}\n**Flags:** ${pfptarget.flags.toArray().join(', ').replace('_', ' ')}\n**Created on:** <t:${accountCreated}:D> at <t:${accountCreated}:t> (Translated into your time zone)\n**Accent color:** ${pfptarget.hexAccentColor}\n**Avatar hash:** ${pfptarget.avatar}\n**Banner hash:** ${pfptarget.banner}\n**Avatar URL:** [Link↗](${pfptarget.displayAvatarURL()})\n**Banner URL:** [Link↗](${pfptarget.bannerURL()})`)
			.setThumbnail(pfptarget.avatarURL({ dynamic: true, size: 512 }) || 'https://img.icons8.com/ios/500/shrug-emoticon.png')
			.setTimestamp();
		if (interaction.guild !== null) {
			const guildMember = interaction.guild.members.cache.find(user => user.id === pfptarget.id);
			const joinedGuild = Math.round(guildMember.joinedTimestamp / 1000);
			pfpembed.addField('Server-specific information', `**Joined on: ** <t:${joinedGuild}:D> at <t:${joinedGuild}:t> (Translated into your time zone)\n**Display name:** ${guildMember.displayName}\n**Display color:** ${guildMember.displayHexColor}\n**Pending membership:** ${guildMember.pending}\n**Kickable:** ${guildMember.kickable}\n**Bannable:** ${guildMember.bannable}`);
		}
		interaction.reply({ embeds: [pfpembed] });
	},
};
