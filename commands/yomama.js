const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
	name: 'yomama', // command name
	description: 'Insults your mom.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	data: new SlashCommandBuilder()
		.setName('yomama')
		.setDescription('Insults your mom.'),

	async execute(interaction) { // inside here command stuff
		const yomamaurl = 'https://kemosaf.github.io/yomama-api/'; // yo mama api
		let joke = '';
		await interaction.deferReply();
		const browser = await puppeteer.launch({
			headless: true,
		});
		const page = await browser.newPage();
		let count = 0;
		while (count < 5) {
			try {
				await page.goto(yomamaurl, {
					waitUntil: 'networkidle0',
				});
				const jsonText = await page.$eval('#joke', el => el.textContent);
				try {
					joke = JSON.parse(jsonText).joke;
				} catch (error) {
					console.error('Error parsing JSON:', error);
					count++;
					continue; // Skip this iteration and try again
				}
				if (joke.startsWith('Yo mama\'s like') || joke.startsWith('Yo mama is like')) {
					continue;
				} else {
					break;
				}
			} catch (error) {
				const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
				throw returnError;
			}
		}
		await browser.close();
		try {
			const jokeembed = new EmbedBuilder()
				.setTitle('Yo Mama Joke')
				.setDescription(joke)
				.setFooter({ text: 'From kemosaf on GitHub' })
				.setColor('Random');
			await interaction.editReply({ embeds: [jokeembed] });
		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};