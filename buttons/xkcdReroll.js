const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	customId: 'xkcdreroll',
	permissions: [],
	myPermissions: [],
	async execute(interaction) {
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
				.then(async response => maxComic = response.num);
		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
		let targetComic = Math.floor(Math.random() * maxComic + 1);
		if (targetComic === 404) targetComic++;
		try {
			await fetch(`https://xkcd.com/${targetComic}/info.0.json`, { method: 'Get' })
				.then(response => response.json())
				.then(response => {
					const xkcdEmbed = new EmbedBuilder()
						.setTitle(response.title)
						.setURL(`https://xkcd.com/${targetComic}`)
						.setColor('Random')
						.setImage(response.img)
						.setFooter({ text: `"${response.alt}"\n#${targetComic}, ${response.month}/${response.day}/${response.year}` });
					try {
						interaction.message.edit({ embeds: [xkcdEmbed], components: [row] });
						interaction.deferUpdate();
					} catch (error) {
						console.log(error);
						interaction.message.edit({ content: 'Oops, something went wrong, try again!' });
						interaction.deferUpdate();
					}
				});
		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};