const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'serverinfo', // command name
	description: 'Gets the server info', // command description
	args: false, // needs arguments?
	usage: '', // usage instructions w/o command name and prefix
	guildOnly: true, // execute in a guild only?
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: [], // permissions required for bot
	ownerOnly: false, // need to be the owner? delete line if no
	disabled: false, // command disabled to all? delete line if no
	aliases: ['guildinfo'],
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Gets the server info'),

	async execute(interaction) { // inside here command stuff
		const targetGuild = await interaction.guild.fetch();
		if (targetGuild.avaliable === false) return (interaction.reply('Ohnoes! This server appears to be unavaliable at this time, try again later!'));
		try {
			const serverInfoEmbed = await new Discord.MessageEmbed()
				.setTitle('Server info')
				.setDescription(`**Name:** ${targetGuild.name}\n**Acronym:** ${targetGuild.nameAcronym}\n**AFK Channel:** ${targetGuild?.afkChannel?.name ?? 'undefined'}, ${targetGuild?.afkChannelId ?? 'undefined'}\n**AFK Timeout:** ${targetGuild.afkTimeout} seconds\n**Member count:** ${targetGuild.memberCount}\n**Banner:** [Link↗](${targetGuild.bannerURL()})\n**Channels:** ${targetGuild.channels.cache.size}\n**Created on:** <t:${Math.round(targetGuild.createdTimestamp / 1000)}:D> at <t:${Math.round(targetGuild.createdTimestamp / 1000)}:t> (Translated into your time zone)\n**Default notifications:** ${targetGuild.defaultMessageNotifications}\n**Description:** ${targetGuild?.description ?? 'undefined'}\n**Discovery splash:** [Link↗](${targetGuild.discoverySplashURL()})\n**Explicit content filter:** ${targetGuild.explicitContentFilter}\n**Features:** ${targetGuild.features.join(', ')}\n**ID:** ${targetGuild.id}\n**Large:** ${targetGuild.large}\n**Max bitrate:** ${targetGuild.maximumBitrate}\n**Max members:** ${targetGuild.maximumMembers}\n**Max presences:** ${targetGuild.maximumPresences}\n**MFA level:** ${targetGuild.mfaLevel}\n**NSFW level:** ${targetGuild.nsfwLevel}\n**Partnered:** ${targetGuild.partnered}\n**Preferred locale:** ${targetGuild.preferredLocale}\n**Premium progress bar:** ${targetGuild.premiumProgressBarEnabled}\n**Premium subscriptions:** ${targetGuild.premiumSubscriptionCount}\n**Premium tier:** ${targetGuild.premiumTier}\n**Public updates channel:** ${targetGuild?.publicUpdatesChannel?.name ?? 'undefined'}, ${targetGuild?.publicUpdatesChannelId ?? 'undefined'}\n**Rules channel:** ${targetGuild?.rulesChannel?.name ?? 'undefined'}, ${targetGuild?.rulesChannelId ?? 'undefined'}\n**System channel:** ${targetGuild?.systemChannel?.name ?? 'undefined'}, ${targetGuild?.systemChannelId ?? 'undefined'}\n**Vanity URL code:** ${targetGuild?.vanityURLCode ?? 'undefined'}\n**Verification level:** ${targetGuild.verificationLevel}\n**Verified:** ${targetGuild.verified}\n**Widget channel:** ${targetGuild?.widgetChannel ?? 'undefined'}, ${targetGuild?.widgetChanelId ?? 'undefined'}\n**Widget enabled:** ${targetGuild.widgetEnabled}\n**Invite splash:** [Link↗](${targetGuild.splashURL()})`)
				.setAuthor('Details provided by Harold, recorded by Discord', interaction.client.user.avatarURL(), 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
				.setColor('RANDOM')
				.setThumbnail(targetGuild.iconURL({ dynamic: true, size: 512 }) ? targetGuild.iconURL({ dynamic: true, size: 512 }) : 'https://i.imgflip.com/69ocml.jpg')
				.setTimestamp();
			await interaction.reply({ embeds: [serverInfoEmbed] });
		}
		catch (error) {
			throw new Error(error.stack);
		}
	},
};