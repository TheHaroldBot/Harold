const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'bored', // command name
	description: 'Gives you something to do.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 1, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	data: new SlashCommandBuilder()
		.setName('bored')
		.setDescription('Gives you a suggestion of something to do.'),

	async execute(interaction) { // inside here command stuff
		try {
			const boredurl = 'https://bored-api.appbrewery.com/random';
			const boredsettings = { method: 'Get' };
			let boredembed = null;
			await fetch(boredurl, boredsettings) // im bored
				.then(response => {
					if (response.status !== 200) {
						throw { message: 'http error ' + response.status, code: response.status, report: false, myMessage: 'Uh-oh, looks like this isn\'t available right now, sorry about that!' };
					}
					return response;
				})
				.then(response => response.json())
				.then(async data => {
					boredembed = new EmbedBuilder()
						.setTitle('Bored? Try this:')
						.setDescription(`${data.activity}\nType: ${data.type}\nParticipants: ${data.participants}\nPrice: ${data.price * 10}/10`)
						.setColor('Random');
					try {
						await interaction.reply({ embeds: [boredembed] });
					} catch (error) {
						throw new Error(error.stack);
					}
				});

		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500 };
			throw returnError;
		}
	},
};