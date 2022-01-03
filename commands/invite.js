const Discord = require('discord.js');
const { invite } = require('../config.json');

module.exports = {
	name: 'invite', // command name
	description: 'Get an invite link to the bot.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	aliases: ['vote'],
	execute(message) { // inside here command stuff
		const inviteembed = new Discord.MessageEmbed()
			.setTitle('Invite or vote here!')
			.setDescription(`Vote for me at [discordbotlist.com](https://discordbotlist.com/bots/harold)\nInvite me [here.](${invite})`)
			.setColor('RANDOM');
		message.reply({ embeds: [inviteembed] });
	},
};