const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'trivia', // command name
	description: 'Trivia questions!', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 2, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	aliases: [],
	execute(message) { // inside here command stuff
		got('https://jservice.io/api/random')
			.then(response => {
				const [body] = JSON.parse(response.body);
				const triviaembed = new Discord.MessageEmbed()
					.setTitle('Catrgory: ' + body.category.title)
					.setDescription(`${body.question}\nAnswer: ||${body.answer}||`)
					.setColor('RANDOM');
				message.channel.send({ embeds: [triviaembed] });
			});
	},
};