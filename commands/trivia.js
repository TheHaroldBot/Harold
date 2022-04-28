const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'trivia', // command name
	description: 'Trivia questions!', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 2, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Trivia questions!'),

	async execute(interaction) { // inside here command stuff
		try {
			await got('https://jservice.io/api/random')
				.then(response => {
					const [body] = JSON.parse(response.body);
					const triviaembed = new Discord.MessageEmbed()
						.setTitle('Catrgory: ' + body.category.title)
						.setDescription(`
							${body.question}
							Answer: ||${body.answer}||
						`)
						.setColor('RANDOM');
					interaction.reply({ embeds: [triviaembed] });
				});
		}
		catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: false, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};