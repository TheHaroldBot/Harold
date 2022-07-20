const { ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	customId: 'resolve',
	myPermissions: [],
	async execute(interaction) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Resolved')
					.setStyle(ButtonStyle.Secondary)
					.setCustomId('resolve'), // remove if style is LINK
			);
		const embed = new EmbedBuilder(interaction.message.embeds[0]);
		embed.setColor('Green');
		interaction.message.edit({ embeds: [embed], components: [row] });
		interaction.deferUpdate();
	},
};