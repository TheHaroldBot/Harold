const Discord = require('discord.js');
let { errorWebhook } = require('../config.json');
const { ownerids } = require('../config.json');

module.exports = {
	name: 'button',
	async execute(interaction) {
		const button = interaction.client.buttons.get(interaction.customId);
		if (!button) return interaction.reply({ content: 'Button not found.', ephemeral: true });
		if (button.permissions && interaction.guild !== null) {
			const authorPerms = interaction.channel.permissionsFor(interaction.member);
			if (!authorPerms || !authorPerms.has(button.permissions)) {
				const missingYourPerms = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/401').setFooter(`You are missing permission to do this. You need ${button.permissions}.`).setColor('RED');
				interaction.reply({ embeds: [missingYourPerms], ephemeral: true });
			}
		}

		if (interaction.guild !== null && button.myPermissions) {
			if (!interaction.channel.permissionsFor(interaction.guild.me).has(button.myPermissions)) {
				const missingMyPerms = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/401').setFooter(`I am missing permission to do this. I need ${button.myPermissions}.`).setColor('RED');
				interaction.reply({ embeds: [missingMyPerms], ephemeral: true });
			}
		}

		try {
			console.log(`Executing button '${button.customId}' on behalf of ${interaction.user.id}`);
			await button.execute(interaction);
		}
		catch (error) {
			errorWebhook = new Discord.WebhookClient(errorWebhook);
			const errorEmbed = new Discord.MessageEmbed()
				.setTitle('Error')
				.setColor('#ff0000')
				.setDescription(`An error occured while executing the command ${button.customId}:\n${error?.myMessage ?? 'Error message undefined'}`)
				.setImage('https://http.cat/' + (error?.code ?? 500));
			console.error(`Error executing ${button.customId}:\n${error}`);
			if (ownerids.includes(interaction.user.id)) errorEmbed.setDescription(`An error occured while executing the command ${button.customId}\n\n\`\`\`error\n${error?.stack ?? error.message}\n\`\`\``);
			await interaction.reply({ ephemeral: true, embeds: [errorEmbed] });
			if (error.report !== false) {
				errorEmbed.setDescription(`An error occured while executing the command ${button.customId}\n\n\`\`\`error\n${error?.stack ?? error.message}\n\`\`\``);
				await errorWebhook.send({ embeds: [errorEmbed] });
			}
		}
	},
};