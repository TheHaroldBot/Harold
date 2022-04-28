const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	name: 'embed', // command name
	description: 'Send an embed using JSON data.\nBuild an embed here: https://eb.nadeko.bot/ then copy the JSON code on the right. (Remove tabs before use)', // command description
	usage: '<JSON>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	args: true,
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Send an embed using JSON data.')
		.addStringOption(option =>
			option.setName('json')
				.setRequired(true)
				.setDescription('The JSON code for the embed.')),

	async execute(interaction) { // inside here command stuff
		const data = interaction.options.getString('json');
		try {
			const embedjson = await new Discord.MessageEmbed(JSON.parse(data));
			await interaction.channel.send({ embeds: [embedjson] });
			await interaction.reply({ content: 'Sent!', ephemeral: true });
		}
		catch (error) {
			console.log('Failed to send a custom embed!');
			const errorembed = await new Discord.MessageEmbed()
				.setTitle('Error!')
				.setDescription(`
					Something went wrong! There are a few possible issues:
					1. You tried to put text in a link option (Like putting 'hello' in the image option, or 'never gonna give you up' in the thumbnail option.)
					2. Something else
					I'll attatch the error below:
				`)
				.addField('Error Message', `>>> ${error.toString()}`)
				.setColor('#ff0000');
			await interaction.reply({ embeds: [errorembed], ephemeral: true });
		}
	},
};
