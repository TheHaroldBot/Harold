const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'xkcd', // command name
	description: 'Gets a random (or latest) xkcd comic', // command description
	args: false, // needs arguments?
	usage: '[comicNumber|latest]', // usage instructions w/o command name and prefix
	guildOnly: false, // execute in a guild only?
	cooldown: 3, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	ownerOnly: false, // need to be the owner? delete line if no
	disabled: false, // command disabled to all? delete line if no
	aliases: ['randomxkcd', 'rnxkcd', 'comic', 'randomcomic', 'rncomic'],
	data: new SlashCommandBuilder()
		.setName('xkcd')
		.setDescription('Gets a random (or latest) xkcd comic')
		.addStringOption(option =>
			option.setName('comicnumber')
				.setRequired(false)
				.setDescription('The comic number to get, or \'latest\' for the latest comic.')),

	async execute(interaction) { // inside here command stuff
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('Reroll')
					.setStyle(ButtonStyle.Primary)
					.setCustomId('xkcdreroll'), // remove if style is LINK
			);
		let maxComic = 0;
		try {
			await fetch('https://xkcd.com/info.0.json', { method: 'Get' })
				.then(response => response.json())
				.then(response => {
					maxComic = response.num;
				});
		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}

		let targetComic = null;
		if (!interaction.options.getString('comicnumber')) {
			targetComic = Math.floor(Math.random() * maxComic + 1);
			if (targetComic === 404) targetComic++;
		} else if (interaction.options.getString('comicnumber') === 'latest') {
			targetComic = maxComic;
		} else {
			targetComic = parseInt(interaction.options.getString('comicnumber'));
		}

		if (!targetComic) return (interaction.reply({ content: 'Comic must be a number, or must be \'latest\'.', flags: MessageFlags.Ephemeral }));
		if (typeof targetComic !== 'number') return (interaction.reply({ content: 'Comic must be a number, or must be \'latest\'.', flags: MessageFlags.Ephemeral }));
		if (targetComic > maxComic) return (interaction.reply({ content: 'Latest comic is ' + maxComic + ', try a lower number.', flags: MessageFlags.Ephemeral }));
		if (targetComic === 404) return (interaction.reply({ content: 'Not found.' }));

		try {
			await fetch(`https://xkcd.com/${targetComic}/info.0.json`, { method: 'Get' })
				.then(response => response.json())
				.then(async response => {
					const xkcdEmbed = new EmbedBuilder()
						.setTitle(response.title)
						.setURL(`https://xkcd.com/${targetComic}`)
						.setColor('Random')
						.setImage(response.img)
						.setFooter({ text: `"${response.alt}"\n#${targetComic}, ${response.month}/${response.day}/${response.year}` });
					try {
						interaction.reply({ embeds: [xkcdEmbed], components: [row] });
					} catch (error) {
						console.log(error);
						interaction.reply({ content: 'Oops, something went wrong, try again!', flags: MessageFlags.Ephemeral });
					}
				});
		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};