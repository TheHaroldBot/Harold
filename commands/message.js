const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	name: 'message', // command name
	description: 'Message someone by ID', // command description
	args: true, // needs arguments? delete line if no
	usage: '<user id> <message>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['msg'], // aliases for command
	data: new SlashCommandBuilder()
		.setName('message')
		.setDescription('Message someone by ID')
		.addStringOption(option =>
			option.setName('userid')
				.setRequired(true)
				.setDescription('The user ID to message.'))
		.addStringOption(option =>
			option.setName('message')
				.setRequired(true)
				.setDescription('The message to send.')),

	async execute(interaction) { // inside here command stuff
		const dmme = await interaction.client.users.fetch(interaction.options.getString('userid'));
		const msgembed = new Discord.MessageEmbed()
			.setTitle('New message!')
			.setAuthor(interaction.user.tag, interaction.user.avatarURL())
			.setDescription('>>> ' + interaction.options.getString('message'))
			.setTimestamp()
			.setColor('RANDOM');
		try {
			await dmme.send({ embeds: [msgembed] });
			await interaction.reply(`Message sent:\n >>> ${interaction.options.getString('message')}`);
		}
		catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: false, myMessage: 'Uh-oh, something went wrong when sending that user a message!' };
			throw returnError;
		}
	},
};