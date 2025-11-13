const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'yomama', // command name
	description: 'Insults your mom.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	aliases: ['urmom'],
	data: new SlashCommandBuilder()
		.setName('yomama')
		.setDescription('Insults your mom.'),

	async execute(interaction) { // inside here command stuff
		const yomamasettings = { method: 'Get' };
		const yomamaurl = 'https://www.yomama-jokes.com/api/random'; // yo mama api
		try {
			await fetch(yomamaurl, yomamasettings)
				.then(res => res.json())
				.then(res => {
					interaction.reply(res.joke);
				});
		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};