/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */

const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, DiscordAPIError, ContextMenuInteraction } = require('discord.js');

module.exports = {
	name: 'test', // command name
	description: 'Test bits of code here', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 1, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: [], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	disabled: false,
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test bits of code here')
		.addStringOption(option =>
			option.setName('option1')
				.setRequired(false)
				.setDescription('A required description for the option.')),

	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Test')
					.setStyle('LINK')
					.setURL('https://google.com/'),
			);
		const row2 = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('test')
					.setPlaceholder('select one :)')
					.addOptions([
						{
							label: 'option1',
							value: 'option1',
							description: 'option1',
						},
					]),
			);
		await interaction.reply({ components: [row, row2] });
	},
};