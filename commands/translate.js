const Discord = require('discord.js');
const { translate } = require('bing-translate-api');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'translate', // command name
	description: 'Translates a message', // command description
	args: true,
	usage: '<message ID to translate>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('Translates a message.')
		.addNumberOption(option =>
			option.setName('messageid')
				.setRequired(true)
				.setDescription('The message ID to translate.')),

	async execute(message, args) { // inside here command stuff
		if (!message.reference) return (message.reply('You didn\'t reply to a message!'));
		const targetMessage = await message.channel.messages.fetch(args[0]);
		translate(targetMessage.content, null, 'en', false).then(res => {
			const translationembed = new Discord.MessageEmbed()
				.setTitle(`From: ${res.language.from}, to: ${res.language.to}`)
				.setDescription(`**Translated:** ${res.translation}`)
				.setColor('RANDOM');
			message.reply({ embeds: [translationembed] });
		}).catch(err => {
			console.error(err);
		});
	},
};
