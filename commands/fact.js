const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'fact', // command name
	description: 'Gets a random fact.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('fact')
		.setDescription('Gets a random fact.'),

	async execute(interaction) { // inside here command stuff
		const factsettings = { method: 'Get' };
		const facturl = 'https://uselessfacts.jsph.pl/random.json?language=en'; // fact api, random fact
		try {
			await fetch(facturl, factsettings)
				.then(res => res.json())
				.then((json) => {
					const factembed = new EmbedBuilder()
						.setTitle('Random Fact')
						.setDescription(json.text.replaceAll('`', '\''))
						.setFooter({ text: 'From djtech.net' })
						.setColor('Random');
					interaction.reply({ embeds: [factembed] });
				})
				.catch(err => {
					console.log(err);
					interaction.reply({ content: 'There was an error completing your request, try again later!', ephemeral: true });
				});
		}
		catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}

	},
};
