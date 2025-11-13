const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');

module.exports = {
	name: 'serverinfo', // command name
	description: 'Gets the server info', // command description
	args: false, // needs arguments?
	usage: '', // usage instructions w/o command name and prefix
	guildOnly: true, // execute in a guild only?
	cooldown: 5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions required for bot
	ownerOnly: false, // need to be the owner? delete line if no
	disabled: false, // command disabled to all? delete line if no
	aliases: ['guildinfo'],
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Gets the server info')
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) { // inside here command stuff
		const targetGuild = await interaction.guild.fetch();
		if (targetGuild.avaliable === false) return (interaction.reply('Ohnoes! This server appears to be unavaliable at this time, try again later!'));
		try {
			const serverInfoEmbed = await new EmbedBuilder()
				.setTitle('Server info')
				.setDescription(`
					**Name:** ${targetGuild.name}
					**Acronym:** ${targetGuild.nameAcronym}
					**AFK Channel:** ${targetGuild?.afkChannel?.name ?? 'undefined'}, ${targetGuild?.afkChannelId ?? 'undefined'}
					**AFK Timeout:** ${targetGuild.afkTimeout} seconds
					**Member count:** ${targetGuild.memberCount}
					**Banner:** [Link↗](${targetGuild.bannerURL()})
					**Channels:** ${targetGuild.channels.cache.size}
					**Created on:** <t:${Math.round(targetGuild.createdTimestamp / 1000)}:D> at <t:${Math.round(targetGuild.createdTimestamp / 1000)}:t> (Translated into your time zone)
					**Default notifications:** ${targetGuild.defaultMessageNotifications}
					**Description:** ${targetGuild?.description ?? 'undefined'}
					**Discovery splash:** [Link↗](${targetGuild.discoverySplashURL()})
					**Explicit content filter:** ${targetGuild.explicitContentFilter}
					**Features:** ${targetGuild.features.join(', ')}
					**ID:** ${targetGuild.id}
					**Large:** ${targetGuild.large}
					**Max bitrate:** ${targetGuild.maximumBitrate}
					**Max members:** ${targetGuild.maximumMembers}
					**Max presences:** ${targetGuild.maximumPresences}
					**MFA level:** ${targetGuild.mfaLevel}
					**NSFW level:** ${targetGuild.nsfwLevel}
					**Partnered:** ${targetGuild.partnered}
					**Preferred locale:** ${targetGuild.preferredLocale}
					**Premium progress bar:** ${targetGuild.premiumProgressBarEnabled}
					**Premium subscriptions:** ${targetGuild.premiumSubscriptionCount}
					**Premium tier:** ${targetGuild.premiumTier}
					**Public updates channel:** ${targetGuild?.publicUpdatesChannel?.name ?? 'undefined'}, ${targetGuild?.publicUpdatesChannelId ?? 'undefined'}
					**Rules channel:** ${targetGuild?.rulesChannel?.name ?? 'undefined'}, ${targetGuild?.rulesChannelId ?? 'undefined'}
					**System channel:** ${targetGuild?.systemChannel?.name ?? 'undefined'}, ${targetGuild?.systemChannelId ?? 'undefined'}
					**Vanity URL code:** ${targetGuild?.vanityURLCode ?? 'undefined'}
					**Verification level:** ${targetGuild.verificationLevel}
					**Verified:** ${targetGuild.verified}
					**Widget channel:** ${targetGuild?.widgetChannel ?? 'undefined'}, ${targetGuild?.widgetChanelId ?? 'undefined'}
					**Widget enabled:** ${targetGuild.widgetEnabled}
					**Invite splash:** [Link↗](${targetGuild.splashURL()})
				`)
				.setAuthor({ name: 'Details provided by Harold, recorded by Discord', iconUrl: interaction.client.user.avatarURL(), url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
				.setColor('Random')
				.setThumbnail(targetGuild.iconURL({ dynamic: true, size: 512 }) ? targetGuild.iconURL({ dynamic: true, size: 512 }) : 'https://i.imgflip.com/69ocml.jpg')
				.setTimestamp();
			await interaction.reply({ embeds: [serverInfoEmbed], flags: MessageFlags.Ephemeral });
		}
		catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: false, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};