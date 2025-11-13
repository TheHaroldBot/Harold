const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { logUsage } = require('../functions.js');

module.exports = {
	name: 'selectMenu',
	async execute(interaction) {
		const config = process.haroldConfig;
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Resolve')
					.setStyle('Danger')
					.setCustomId('resolve'), // remove if style is LINK
			);
		const selectMenu = interaction.client.selectMenus.get(interaction.customId);
		if (!selectMenu) return interaction.reply({ content: 'Select menu not found.', flags: MessageFlags.Ephemeral });
		if (selectMenu.permissions && interaction.guild !== null) {
			const authorPerms = interaction.memberPermissions;
			if (!authorPerms || !authorPerms.has(selectMenu.permissions)) {
				const missingYourPerms = new EmbedBuilder().setTitle('Error!').setImage('https://http.cat/401').setFooter({ text: `You are missing permission to do this. You need ${selectMenu.permissions}.` }).setColor('Red');
				return interaction.reply({ embeds: [missingYourPerms], flags: MessageFlags.Ephemeral });
			}
		}

		if (interaction.guild !== null && selectMenu.myPermissions) {
			if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(selectMenu.myPermissions)) {
				const missingMyPerms = new EmbedBuilder().setTitle('Error!').setImage('https://http.cat/401').setFooter({ text: `I am missing permission to do this. I need ${selectMenu.myPermissions}.` }).setColor('Red');
				return interaction.reply({ embeds: [missingMyPerms], flags: MessageFlags.Ephemeral });
			}
		}

		try {
			console.log(`Executing select menu '${selectMenu.customId}' on behalf of ${interaction.user.id}`);
			logUsage({ name: selectMenu.customId });
			await selectMenu.execute(interaction);
		} catch (error) {
			const errorEmbed = new EmbedBuilder()
				.setTitle('Error')
				.setColor('#ff0000')
				.setDescription(`An error occured while executing the command ${selectMenu.customId}:\n${error?.myMessage ?? 'Error message undefined'}`)
				.setImage('https://http.cat/' + (error?.code ?? 500));
			console.error(`Error executing ${selectMenu.customId}:\n${error}`);
			if (config.ownerids.includes(interaction.user.id)) errorEmbed.setDescription(`An error occured while executing the command ${selectMenu.customId}\n\n\`\`\`error\n${error?.stack ?? error.message}\n\`\`\``);
			try {
				await interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [errorEmbed] });
			} catch {
				await interaction.editReply({ flags: MessageFlags.Ephemeral, embeds: [errorEmbed] });
			}
			if (error.report !== false) {
				errorEmbed.setDescription(`An error occured while executing the command ${selectMenu.customId}\n\n\`\`\`error\n${error?.stack ?? error.message}\n\`\`\``);
				await interaction.client.channels.cache.get(config.errorChannel).send({ embeds: [errorEmbed], components: [row] });
			}
		}
	},
};