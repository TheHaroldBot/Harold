const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { logUsage } = require('../functions.js');

module.exports = {
	name: 'button',
	async execute(interaction) {
		const config = process.haroldConfig;
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Resolve')
					.setStyle('Danger')
					.setCustomId('resolve'), // remove if style is LINK
			);
		const button = interaction.client.buttons.get(interaction.customId);
		if (!button) return interaction.reply({ content: 'Button not found.', ephemeral: true });
		if (button.permissions && interaction.guild !== null) {
			const authorPerms = interaction.memberPermissions;
			if (!authorPerms || !authorPerms.has(button.permissions)) {
				const missingYourPerms = new EmbedBuilder().setTitle('Error!').setImage('https://http.cat/401').setFooter({ text: `You are missing permission to do this. You need ${button.permissions}.` }).setColor('Red');
				return interaction.reply({ embeds: [missingYourPerms], ephemeral: true });
			}
		}

		if (interaction.guild !== null && button.myPermissions) {
			if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(button.myPermissions)) {
				const missingMyPerms = new EmbedBuilder().setTitle('Error!').setImage('https://http.cat/401').setFooter({ text: `I am missing permission to do this. I need ${button.myPermissions}.` }).setColor('Red');
				return interaction.reply({ embeds: [missingMyPerms], ephemeral: true });
			}
		}

		try {
			console.log(`Executing button '${button.customId}' on behalf of ${interaction.user.id}`);
			logUsage(button.customId)
			await button.execute(interaction);
		}
		catch (error) {
			const errorEmbed = new EmbedBuilder()
				.setTitle('Error')
				.setColor('#ff0000')
				.setDescription(`An error occured while executing the command ${button.customId}:\n${error?.myMessage ?? 'Error message undefined'}`)
				.setImage('https://http.cat/' + (error?.code ?? 500));
			console.error(`Error executing ${button.customId}:\n${error}`);
			if (config.ownerids.includes(interaction.user.id)) errorEmbed.setDescription(`An error occured while executing the command ${button.customId}\n\n\`\`\`error\n${error?.stack ?? error.message}\n\`\`\``);
			try {
				await interaction.reply({ ephemeral: true, embeds: [errorEmbed] });
			}
			catch {
				await interaction.editReply({ ephemeral: true, embeds: [errorEmbed] });
			}
			if (error.report !== false) {
				errorEmbed.setDescription(`An error occured while executing the command ${button.customId}\n\n\`\`\`error\n${error?.stack ?? error.message}\n\`\`\``);
				await interaction.client.channels.cache.get(config.errorChannel).send({ embeds: [errorEmbed], components: [row] });
			}
		}
	},
};