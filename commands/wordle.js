const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { words } = require('../resources/wordleWords.json');

module.exports = {
	name: 'wordle', // command name
	description: 'Generates a list of possible wordle solutions', // command description
	args: true, // needs arguments?
	usage: '<green letters or \\*. EX: \\*\\*a\\*\\* or \\*b\\*\\*a. Autocomplete will tell you if it\'s invalid. Use \\*\\*\\*\\*\\* if you have none>, <yellow letters>, <excluded letters>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	myPermissions: [], // permissions required for bot
	ownerOnly: false, // need to be the owner? delete line if no
	disabled: false, // command disabled to all? delete line if no
	data: new SlashCommandBuilder()
		.setName('wordle')
		.setDescription('Generates a list of possible words solutions')
		.addStringOption(option =>
			option.setName('greenletters')
				.setRequired(true)
				.setAutocomplete(true)
				.setDescription('The green letters you have, enter 5 characters. Example: **a** or *b**a. See help menu.')
				.setMinLength(5)
				.setMaxLength(5))
		.addStringOption(option =>
			option.setName('yellowletters')
				.setRequired(false)
				.setDescription('The yellow letters you have')
				.setMaxLength(5)
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('excludedletters')
				.setRequired(false)
				.setDescription('The excluded, or gray letters you have')),

	async autoComplete(interaction) {
		const focused = interaction.options.getFocused(true);
		if (focused.name === 'greenletters') {
			if (/^[a-zA-Z*]{5}$/g.test(focused.value)) {
				return [{
					name: focused.value,
					value: focused.value,
				}];
			}
			else {
				return [{
					name: 'Invalid input',
					value: 'invalid',
				}];
			}
		}
		if (focused.name === 'yellowletters') {
			if (/^[a-zA-Z]{1,5}$/g.test(focused.value)) {
				return [{
					name: focused.value,
					value: focused.value,
				}];
			}
			else {
				return [{
					name: 'Invalid input',
					value: 'Invalid',
				}];
			}
		}
	},

	execute(interaction) { // inside here command stuff
		// interaction.deferReply();

		const green = interaction.options.getString('greenletters').split(''); // green letters are required, so no issues there.
		const yellow = (interaction.options.getString('yellowletters') ?? '').split(''); // yellow letters are not required, so we provide an empty string to split if no letters are provided.
		green.forEach(character => {
			if (character !== '*') yellow.push(character);
		});
		const excluded = (interaction.options.getString('excludedletters') ?? '').split(''); // excluded letters are not required, so we provide an empty string to split if no letters are provided.

		const stage1 = []; // words filtered for excluded letters
		const stage2 = []; // words filtered for included letters
		const stage3 = []; // words filtered for specific letters


		words.forEach(word => {
			let wordContainsBadLetter = false;
			excluded.forEach(badLetter => {
				if (word.split('').includes(badLetter)) wordContainsBadLetter = true;
			});

			if (!wordContainsBadLetter) stage1.push(word);
		});

		// stage 1 complete, we now have a list of words that don't contain any of the excluded words.

		stage1.forEach(word => {
			const letters = word.split('');

			const wordContainsGoodLetters = yellow.every(goodLetter => // for every element in the yellow array, check if the letters array includes the element from the yellow array
				letters.includes(goodLetter),
			);

			if (wordContainsGoodLetters) stage2.push(word);
		});

		// stage 2 complete, we now have a list of words that do contain the yellow letters.

		stage2.forEach(word => {
			let wordMatchesGreatLetters = true;
			const letters = word.split('');
			for (let index = 0; index < green.length; index++) {
				const greatLetter = green[index];

				if (greatLetter !== letters[index] && greatLetter !== '*') wordMatchesGreatLetters = false;
			}
			if (wordMatchesGreatLetters) stage3.push(word);
		});

		// stage 3 complete, we now have a list of words that do contain the green letters in the right places.

		const results = new EmbedBuilder()
			.setTitle('The results are in!')
			.setDescription(stage3.join('\n').substring(0, 4096))
			.setColor('Random');

		interaction.reply({ embeds: [results], flags: MessageFlags.Ephemeral });
	},
};