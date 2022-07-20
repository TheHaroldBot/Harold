const { ButtonStyle, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const { bugChannel } = require('../config.json');

module.exports = {
	name: 'bugreport',
	description: 'Contact the developers regarding a bug, exploit, feature request, feedback, or just to talk',
	args: true,
	usage: '<message>',
	cooldown: 60,
	myPermissions: [PermissionFlagsBits.SendMessages],
	aliases: ['messagedevs', 'telldevs', 'suggest', 'reportbug', 'bug', 'feedback', 'report'],
	data: new SlashCommandBuilder()
		.setName('bugreport')
		.setDescription('Contact the developers regarding a bug, exploit, feature request, feedback, or just to talk')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The message you want to send to the developers')
				.setRequired(true)),

	async execute(interaction) {
		const bugreportembed = new EmbedBuilder()
			.setTitle('New Message!')
			.addFields([
				{ name: 'Info', value: `From ${interaction.user.tag}` },
				{ name: 'Description', value: interaction.options.getString('message') },
			])
			.setColor('Yellow');
		if (interaction.guild) {
			bugreportembed.addFields([
				{ name: 'From guild:', value: `Name: ${interaction.guild.name}, ID: ${interaction.guild.id}\nUser ID: ${interaction.user.id}` },
			]);
		}
		else {
			bugreportembed.addFields([
				{ name: 'From direct message:', value: `No guild information avaliable.\nUser ID: ${interaction.user.id}` },
			]);
		}
		bugreportembed.addFields([
			{ name: 'Contact method:', value: 'You can send a friend request to the sender, or talk through harold with `/message`.' },
		]);
		const bugreportRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Resolve')
					.setStyle(ButtonStyle.Success)
					.setEmoji('✅')
					.setCustomId('resolve'), // remove if style is LINK
			);
		const supportchannel = interaction.client.channels.cache.get(bugChannel);
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
