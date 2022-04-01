const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'joke', // command name
	description: 'Tells you a joke.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
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
				.then((json) => {
					const jokeembed = new Discord.MessageEmbed()
						.setTitle(json.setup)
						.setDescription(json.delivery)
						.setColor('RANDOM')
						.setFooter('jokeapi.dev');
					interaction.editReply({ embeds: [jokeembed], ephemeral: false });
				});
		}
		catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};