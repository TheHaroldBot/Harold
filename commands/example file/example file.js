const { PermissionFlagsBits, InteractionContextType, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'args-info', // command name
	description: 'Information about the arguments provided.', // command description
	args: true, // needs arguments? delete line if no
	usage: '<args>', // usage instructions w/o command name and prefix
	guildOnly: true, // execute in a guild only? remove line if no
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: ['KICK_MEMBERS', 'BAN_MEMBERS'], // permissions required for command
	myPermissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	disabled: true, // command disabled to all? delete line if no
	data: new SlashCommandBuilder()
		.setName('example')
		.setDescription('A command template')
		.setContexts(InteractionContextType.Guild) // Remove to allow in DMs
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers)
		.addStringOption(option =>
			option.setName('option1')
				.setRequired(true)
				.setDescription('A required description for the option.'))
		.addStringOption(option =>
			option.setName('option2')
				.setRequired(true)
				.setDescription('A required description for the option.')
				.addChoices(
					{
						name: 'choice1',
						value: 'choice1',
					},
				)),

	execute(message, args) { // inside here command stuff
		if (args[0] === 'foo') {
			return message.reply('bar');
		}
	},
};