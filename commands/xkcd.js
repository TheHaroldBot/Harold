const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'xkcd', // command name
	description: 'Gets a random xkcd comic', // command description
	args: false, // needs arguments?
	usage: '[comic]', // usage instructions w/o command name and prefix
	guildOnly: false, // execute in a guild only?
	cooldown: 3, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	ownerOnly: false, // need to be the owner? delete line if no
	disabled: false, // command disabled to all? delete line if no
	aliases: ['randomxkcd', 'rnxkcd', 'comic', 'randomcomic', 'rncomic'],
	async execute(message, args) { // inside here command stuff
		let maxComic = 0;
		if (!args.length) {
			await got('https://xkcd.com/info.0.json')
				.then(response => {
					const body = JSON.parse(response.body);
					maxComic = body.num;
					console.log('max: ' + maxComic);
				})
				.catch(err => {
					console.log(err);
				});
			const targetComic = Math.floor(Math.random() * maxComic + 1);
			console.log('Target: ' + targetComic);
			await got(`https://xkcd.com/${targetComic}/info.0.json`)
				.then(response => {
					response = JSON.parse(response.body);
					const xkcdEmbed = new Discord.MessageEmbed()
						.setTitle(response.title)
						.setURL(`https://xkcd.com/${targetComic}`)
						.setColor('RANDOM')
						.setImage(response.img)
						.setFooter(`"${response.alt}"\n${response.month}/${response.day}/${response.year}`);
					try {
						message.channel.send({ embeds: [xkcdEmbed] });
					}
					catch (error) {
						console.log(error);
						message.reply('Oops, something went wrong, try again!');
					}
				});
		}
		else {
			const targetComic = parseInt(args[0]);
			if (!targetComic) return (message.reply('Comic must be a number.'));
			if (typeof targetComic !== 'number') return (message.reply('Comic must be a number.'));
			await got(`https://xkcd.com/${targetComic}/info.0.json`)
				.then(response => {
					response = JSON.parse(response.body);
					const xkcdEmbed = new Discord.MessageEmbed()
						.setTitle(response.title)
						.setURL(`https://xkcd.com/${targetComic}`)
						.setColor('RANDOM')
						.setImage(response.img)
						.setFooter(`"${response.alt}"\n${response.month}/${response.day}/${response.year}`);
					try {
						message.channel.send({ embeds: [xkcdEmbed] });
					}
					catch (error) {
						console.log(error);
						message.reply('Oops, something went wrong, try again!');
					}
				});
		}

	},
};