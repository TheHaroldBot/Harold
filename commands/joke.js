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
	execute(message) { // inside here command stuff
		const jokesettings = { method: 'Get' };
		const jokeurl = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,explicit,racist&type=twopart'; // random joke api
		fetch(jokeurl, jokesettings)
			.then(res => res.json())
			.then((json) => {
				const jokeembed = new Discord.MessageEmbed()
					.setTitle(json.setup)
					.setDescription(json.delivery)
					.setColor('RANDOM')
					.setFooter('jokeapi.dev');
				message.reply({ embeds: [jokeembed] });
			})
			.catch(err => {
				console.log(err);
				message.reply('There was an error completing your request, try again later!');
			});
	},
};