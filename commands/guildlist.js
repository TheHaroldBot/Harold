const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'guildlist', // command name
	description: 'Lists all guilds the bot is in.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['serverlist', 'guildcount'],
	data: new SlashCommandBuilder()
		.setName('guildlist')
		.setDescription('Lists all guilds the bot is in.'),

	async execute(interaction) { // inside here command stuff
		try {
			await interaction.reply(`We are in \`${interaction.client.guilds.cache.size}\` servers!`);
		}
		catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}

	},
};