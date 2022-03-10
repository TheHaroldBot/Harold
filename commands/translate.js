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
		.addStringOption(option =>
			option.setName('messageid')
				.setRequired(true)
				.setDescription('The message ID to translate.')),

	async execute(interaction) { // inside here command stuff
		const targetMessageId = parseInt(interaction.options.getString('messageid'));
		if (typeof targetMessageId !== 'number') return (interaction.reply({ content: 'Invalid message ID.', ephemeral: true }));
		let targetMessage;
		try {
			targetMessage = await interaction.channel.messages.fetch(interaction.options.getString('messageid'));
			await translate(targetMessage.content, null, 'en', false).then(res => {
				const translationembed = new Discord.MessageEmbed()
					.setTitle(`From: ${res.language.from}, to: ${res.language.to}`)
					.setDescription(`**Translated:** ${res.translation}`)
					.setColor('RANDOM');
				interaction.reply({ embeds: [translationembed] });
			});
		}
		catch (error) {
			interaction.reply({ content: 'Invalid message ID.', ephemeral: true });
		}

	},
};
