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
		.setDescription('Sets the bot\'s status')
		.addSubcommand(subcommand =>
			subcommand.setName('presence')
				.setDescription('Sets the bot\'s presence.')
				.addStringOption(option =>
					option.setName('presence')
						.setRequired(true)
						.setDescription('The presence to set.')
						.addChoices([
							['online', 'online'],
							['invisible', 'invisible'],
							['dnd', 'dnd'],
							['idle', 'idle'],
						]),
				),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('activity')
				.setDescription('Sets the bot\'s activity type.')
				.addStringOption(option =>
					option.setName('type')
						.setRequired(true)
						.setDescription('The activity type.')
						.addChoices([
							['PLAYING', 'PLAYING'],
							['STREAMING', 'STREAMING'],
							['LISTENING', 'LISTENING'],
							['WATCHING', 'WATCHING'],
							['COMPETING', 'COMPETING'],
						]),
				)
				.addStringOption(option =>
					option.setName('name')
						.setRequired(true)
						.setDescription('The activity name.'),
				)
				.addStringOption(option =>
					option.setName('url')
						.setRequired(false)
						.setDescription('The activity url.'),
				),
		),
	execute(interaction) { // inside here command stuff
		if (interaction.options.getSubcommand() === 'presence') {
			interaction.client.user.setPresence({ status: interaction.options.getString('presence') });
			interaction.reply(`Status set to ${interaction.options.getString('presence')}`);
		}
		else if (interaction.options.getSubcommand() === 'activity') {
			interaction.client.user.setActivity(interaction.options.getString('name'), {
				type: interaction.options.getString('type'),
				url: interaction.options.getString('url'),
			});
			interaction.reply(`Activity set to ${interaction.options.getString('type')} ${interaction.options.getString('name')}`);
		}

	},
};