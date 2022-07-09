const Discord = require('discord.js');

module.exports = {
	customId: 'resolve',
	myPermissions: [],
	async execute(interaction) {
		const embed = new Discord.MessageEmbed(interaction.message.embeds[0]);
		const row = new Discord.MessageActionRow(interaction.message.components[0]);
		embed.setColor('GREEN');
		row.components[0].setDisabled(true).setStyle('SECONDARY').setLabel('Resolved');
		interaction.message.edit({ embeds: [embed], components: [row] });
		interaction.deferUpdate();
	},
};