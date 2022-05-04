const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	name: 'bugreport',
	description: 'Contact the developers regarding a bug, exploit, feature request, feedback, or just to talk',
	args: true,
	usage: '<message>',
	cooldown: 60,
	myPermissions: ['SEND_MESSAGES'],
	aliases: ['messagedevs', 'telldevs', 'suggest', 'reportbug', 'bug', 'feedback', 'report'],
	data: new SlashCommandBuilder()
		.setName('bugreport')
		.setDescription('Contact the developers regarding a bug, exploit, feature request, feedback, or just to talk')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The message you want to send to the developers')
				.setRequired(true)),

	async execute(interaction) {
		const bugreportembed = new Discord.MessageEmbed()
			.setTitle('New Message!')
			.addField('Info', `From ${interaction.user.tag}`)
			.setColor('YELLOW')
			.addField('Description', interaction.options.getString('message'));
		if (interaction.guild) {
			bugreportembed.addField('From guild:', `Name: ${interaction.guild.name}, ID: ${interaction.guild.id}\nUser ID: ${interaction.user.id}`);
		}
		else {
			bugreportembed.addField('From direct message:', `No guild information avaliable.\nUser ID: ${interaction.user.id}`);
		}
		bugreportembed.addField('Contact method:', 'You can send a friend request to the sender, or talk through harold with `/message`.');
		const bugreportRow = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setLabel('Resolve')
					.setStyle('SUCCESS')
					.setEmoji('✅')
					.setCustomId('bugreportConfirm'), // remove if style is LINK
			);
		const supportchannel = interaction.client.channels.cache.get('905621722978467860');
		try {
			await supportchannel.send({ embeds: [bugreportembed], components: [bugreportRow] });
			// await bugReportWebhook.send({ embeds: [bugreportembed] });
			await interaction.reply('Sent! If you receive a friend request from one of the owners, they might want to talk more. As an alternantive, an owner may talk through Harold.');
		}
		catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500 };
			throw returnError;
		}

	},
};
