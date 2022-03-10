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

	execute(interaction) {
		const bugreportembed = new Discord.MessageEmbed()
			.setTitle('New Message!')
			.addField('Info', `From ${interaction.user.tag}`)
			.setColor('RANDOM')
			.addField('Description', interaction.options.getString('message'));
		if (interaction.guild) {
			bugreportembed.addField('From guild:', `Name: ${interaction.guild.name}, ID: ${interaction.guild.id}\nUser ID: ${interaction.user.id}`);
		}
		else {
			bugreportembed.addField('From direct message:', `No guild information avaliable.\nUser ID: ${interaction.user.id}`);
		}
		bugreportembed.addField('Contact method:', 'You can send a friend request to the sender, or talk through harold with `/message`.');
		const supportchannel = interaction.client.channels.cache.get('905621722978467860');
		supportchannel.send({ embeds: [bugreportembed] });
		interaction.reply('Sent! If you receive a friend request from one of the owners, they might want to talk more. As an alternantive, an owner may talk through Harold.');
	},
};
