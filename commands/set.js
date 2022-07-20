const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: 'set', // command name
	description: 'Sets the bot\'s presence.', // command description
	args: true, // needs arguments? delete line if no
	usage: '<presence|activity|avatar>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Sets the bot\'s status')
		.addSubcommand(subcommand =>
			subcommand.setName('presence')
				.setDescription('Sets the bot\'s presence.')
				.addStringOption(option =>
					option.setName('presence')
						.setRequired(true)
						.setDescription('The presence to set.')
						.addChoices(
							{
								name: 'online',
								value: 'online',
							},
							{
								name: 'invisible',
								value: 'invisible',
							},
							{
								name: 'dnd',
								value: 'dnd',
							},
							{
								name: 'idle',
								value: 'idle',
							},
						),
				),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('activity')
				.setDescription('Sets the bot\'s activity type.')
				.addStringOption(option =>
					option.setName('type')
						.setRequired(true)
						.setDescription('The activity type.')
						.addChoices(
							{
								name: 'playing',
								value: 'PLAYING',
							},
							{
								name: 'streaming',
								value: 'STREAMING',
							},
							{
								name: 'listening',
								value: 'LISTENING',
							},
							{
								name: 'watching',
								value: 'WATCHING',
							},
							{
								name: 'competing',
								value: 'COMPETING',
							},
						),
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
		)
		.addSubcommand(subcommand =>
			subcommand.setName('avatar')
				.setDescription('Sets the bot\'s avatar.')
				.addStringOption(option =>
					option.setName('url')
						.setRequired(true)
						.setDescription('The avatar url.'),
				),
		),
	async execute(interaction) { // inside here command stuff
		if (interaction.options.getSubcommand() === 'presence') {
			try {
				await interaction.client.user.setPresence({ status: interaction.options.getString('presence') });
				await interaction.reply(`Status set to ${interaction.options.getString('presence')}`);
			}
			catch (error) {
				const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong when setting the presence!' };
				throw returnError;
			}
		}
		else if (interaction.options.getSubcommand() === 'activity') {
			try {
				await interaction.client.user.setActivity(interaction.options.getString('name'), {
					type: interaction.options.getString('type'),
					url: interaction.options.getString('url'),
				});
				await interaction.reply(`Activity set to ${interaction.options.getString('type')} ${interaction.options.getString('name')}`);
			}
			catch (error) {
				const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong when setting a game!' };
				throw returnError;
			}
		}
		else if (interaction.options.getSubcommand() === 'avatar') {
			try {
				await interaction.client.user.setAvatar(interaction.options.getString('url'));
				await interaction.reply(`Avatar set to ${interaction.options.getString('url')}`);
			}
			catch (error) {
				interaction.reply('Error setting avatar, check your URL and try again.');
			}
		}

	},
};