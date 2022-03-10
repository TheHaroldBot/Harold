const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'setstatus', // command name
	description: 'Sets the bot\'s presence.', // command description
	args: true, // needs arguments? delete line if no
	usage: '<online|invisible|dnd|idle>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('setstatus')
		.setDescription('Sets the bot\'s presence.')
		.addStringOption(option =>
			option.setName('status')
				.setRequired(true)
				.setDescription('The status to set.')
				.addChoices([
					['online', 'online'],
					['invisible', 'invisible'],
					['dnd', 'dnd'],
					['idle', 'idle'],
				])),

	execute(interaction) { // inside here command stuff
		interaction.client.user.setPresence({ status: interaction.options.getString('status') });
		interaction.reply(`Status set to ${interaction.options.getString('status')}`);
	},
};