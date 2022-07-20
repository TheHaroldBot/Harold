const { Discord, ButtonStyle } = require('discord.js');

module.exports = {
	customId: 'resolve',
	myPermissions: [],
	async execute(interaction) {
		const row = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.ButtonBuilder()
					.setLabel('Resolved')
					.setStyle(ButtonStyle.Secondary)
					.setCustomId('resolve'), // remove if style is LINK
			);
		const embed = new Discord.EmbedBuilder(interaction.message.embeds[0]);
		embed.setColor('GREEN');
		interaction.message.edit({ embeds: [embed], components: [row] });
		interaction.deferUpdate();
	},
};