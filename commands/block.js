const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'block', // command name
	description: 'Blocks a user from using the bot', // command description
	args: true, // needs arguments? delete line if no
	usage: '<add|remove> <mention>', // usage instructions w/o command name and prefix
	cooldown: 1, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	disabled: false,
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('block')
		.setDescription('Blocks or unblocks a user from using the bot.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Whether to block or unblock the user.')
				.setRequired(true)
				.addChoices(
					{
						name: 'Add',
						value: 'add',
					},
					{
						name: 'Remove',
						value: 'remove',
					},
				),
		)
		.addStringOption(option =>
			option.setName('userid')
				.setDescription('The user ID to block or unblock.')
				.setRequired(true)
				.setMinLength(17)
				.setMaxLength(18))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Why they are blocked')
				.setRequired(true),
		),
	/* .addBooleanOption(option =>
			option.setName('notify')
				.setDescription('DM them with the reason, or notify of being unblocked. Default false')
				.setRequired(true),
		) */

	execute(interaction) { // inside here command stuff
		if (interaction.options.getString('type') === 'add') {
			const data = JSON.parse(fs.readFileSync('././config.json'));
			if (data.blocked[interaction.options.getString('userid')]) return (interaction.reply('That person is already blocked.'));
			process.haroldConfig.blocked[interaction.options.getString('userid')] = interaction.options.getString('reason');
			fs.writeFileSync('././config.json', JSON.stringify(process.haroldConfig, null, 4));
			// add dm code
			interaction.reply(`Successfully blocked ${interaction.options.getString('userid')}.`);
		}
		else if (interaction.options.getString('type') === 'remove') {
			const data = JSON.parse(fs.readFileSync('././config.json'));
			if (!data.blocked[interaction.options.getString('userid')]) return (interaction.reply('That person is not blocked.'));
			delete process.haroldConfig.blocked[interaction.options.getString('userid')];
			fs.writeFileSync('././config.json', JSON.stringify(process.haroldConfig, null, 4));
			// add dm code
			interaction.reply(`Successfully unblocked ${interaction.options.getString('userid')}.`);
		}
	},
};