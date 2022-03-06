const Discord = require('discord.js');
const got = require('got');

module.exports = {
	name: 'bored', // command name
	description: 'Gives you something to do.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 1, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: ['imbored'],
	execute(message) { // inside here command stuff
		got('https://www.boredapi.com/api/activity') //	im bored
			.then(response => {
				const data = JSON.parse(response.body);
				const boredembed = new Discord.MessageEmbed()
					.setTitle('Bored? Try this:')
					.setDescription(`${data.activity}\nType: ${data.type}\nParticipants: ${data.participants}\nPrice: ${data.price * 10}/10`)
					.setColor('RANDOM');
				message.reply({ embeds: [boredembed] });
			});
	},
};