const { PermissionFlagsBits, SlashCommandBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	name: 'slowmode', // command name
	description: 'Sets the slowmode for a channel.', // command description
	args: true, // needs arguments? delete line if no
	usage: '<slowmode in seconds>', // usage instructions w/o command name and prefix
	guildOnly: true, // execute in a guild only? remove line if no
	cooldown: 5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels], // permissions bot needs for command
	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Sets the slowmode for a channel.')
		.addIntegerOption(option =>
			option.setName('slowmode')
				.setRequired(true)
				.setDescription('The slowmode in seconds.'))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.setContexts(InteractionContextType.Guild),

	async execute(interaction) { // inside here command stuff
		try {
			await interaction.channel.setRateLimitPerUser(interaction.options.getInteger('slowmode'), `${interaction.user.tag} requested a slowmode of ${interaction.options.getInteger('slowmode')} second(s) in #${interaction.channel.name}`);
			await interaction.reply(`Success! Slowmode set to ${interaction.options.getInteger('slowmode')} second(s).`);
		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: false, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};