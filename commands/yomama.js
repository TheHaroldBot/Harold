const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
	name: 'yomama', // command name
	description: 'Insults your mom.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: ['urmom'],
	data: new SlashCommandBuilder()
		.setName('yomama')
		.setDescription('Insults your mom.'),

	execute(interaction) { // inside here command stuff
		const yomamasettings = { method: 'Get' };
		const yomamaurl = 'https://api.yomomma.info/'; // yo mama api
		fetch(yomamaurl, yomamasettings)
			.then(res => res.json())
			.then((json) => {
				interaction.reply(json.joke);
			})
			.catch(err => {
				throw new Error(err.stack);
			});
	},
};