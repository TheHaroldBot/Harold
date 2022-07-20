const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'joke', // command name
	description: 'Tells you a joke.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Tells you a joke.'),

	async execute(interaction) { // inside here command stuff
		await interaction.deferReply({ ephemeral: false });
		const jokesettings = { method: 'Get' };
		const jokeurl = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,explicit,racist&type=twopart'; // random joke api
		try {
			await fetch(jokeurl, jokesettings)
				.then(res => res.json())
				.then(async (json) => {
					const jokeembed = new EmbedBuilder()
						.setTitle(json.setup)
						.setDescription(json.delivery)
						.setColor('Random')
						.setFooter({ text: 'jokeapi.dev' });
					await interaction.editReply({ embeds: [jokeembed], ephemeral: false });
				});
		}
		catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};