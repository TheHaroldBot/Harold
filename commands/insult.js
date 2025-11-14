const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'insult', // command name
	description: 'Insults you, in a pirate fashion.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	data: new SlashCommandBuilder()
		.setName('insult')
		.setDescription('Insults you.'),

	async execute(interaction) { // inside here command stuff
		const insultsettings = { method: 'Get' };
		const insulturl = 'https://evilinsult.com/generate_insult.php?lang=en&type=json'; // new new one since the last was very pirate-y
		await interaction.deferReply();
		try {
			let insult = null;
			await fetch(insulturl, insultsettings)
				.then(res => res.json())
				.then((res) => {
					insult = new EmbedBuilder()
						.setTitle('Here\'s your insult:')
						.setDescription(res.insult)
						.setFooter({ text: 'Insults provided by evilinsult.com' })
						.setColor('Random');
				})
				.catch(err => {
					throw new Error(err.stack);
				});
			interaction.editReply({ embeds: [insult] });
		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};