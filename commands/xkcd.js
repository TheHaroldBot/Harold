const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'xkcd', // command name
	description: 'Gets a random (or latest) xkcd comic', // command description
	args: false, // needs arguments?
	usage: '[comicNumber|latest]', // usage instructions w/o command name and prefix
	guildOnly: false, // execute in a guild only?
	cooldown: 3, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
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
		let maxComic = 0;
		await got('https://xkcd.com/info.0.json')
			.then(response => {
				const body = JSON.parse(response.body);
				maxComic = body.num;
			})
			.catch(err => {
				console.log(err);
			});
		if (!interaction.options.getString('comicnumber')) {
			const targetComic = Math.floor(Math.random() * maxComic + 1);
			await got(`https://xkcd.com/${targetComic}/info.0.json`)
				.then(response => {
					response = JSON.parse(response.body);
					const xkcdEmbed = new Discord.MessageEmbed()
						.setTitle(response.title)
						.setURL(`https://xkcd.com/${targetComic}`)
						.setColor('RANDOM')
						.setImage(response.img)
						.setFooter(`"${response.alt}"\n#${targetComic}, ${response.month}/${response.day}/${response.year}`);
					try {
						interaction.reply({ embeds: [xkcdEmbed] });
					}
					catch (error) {
						console.log(error);
						interaction.reply({ content: 'Oops, something went wrong, try again!', ephemeral: true });
					}
				});
		}
		else {
			let targetComic = null;
			if (interaction.options.getString('comicnumber') === 'latest') {
				targetComic = maxComic;
			}
			else {
				targetComic = parseInt(interaction.options.getString('comicnumber'));
			}
			if (!targetComic) return (interaction.reply({ content: 'Comic must be a number, or must be \'latest\'.', ephemeral: true }));
			if (typeof targetComic !== 'number') return (interaction.reply({ content: 'Comic must be a number, or must be \'latest\'.', ephemeral: true }));
			if (targetComic > maxComic) return (interaction.reply({ content: 'Latest comic is ' + maxComic + ', try a lower number.', ephemeral: true }));
			await got(`https://xkcd.com/${targetComic}/info.0.json`)
				.then(response => {
					response = JSON.parse(response.body);
					const xkcdEmbed = new Discord.MessageEmbed()
						.setTitle(response.title)
						.setURL(`https://xkcd.com/${targetComic}`)
						.setColor('RANDOM')
						.setImage(response.img)
						.setFooter(`"${response.alt}"\n#${targetComic}, ${response.month}/${response.day}/${response.year}`);
					try {
						interaction.reply({ embeds: [xkcdEmbed] });
					}
					catch (error) {
						console.log(error);
						interaction.reply({ content: 'Oops, something went wrong, try again!', ephemeral: true });
					}
				});
		}

	},
};