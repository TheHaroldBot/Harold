const Discord = require('discord.js');

module.exports = {
	name: 'ownerhelp', // command name
	description: 'Help command for the bot owner(s)', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 1, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['ownercommands'],
	execute(message, args, prefix) { // inside here command stuff
		const data = [];
		const { commands } = message.client;

		data.push(commands.filter(command => command.ownerOnly).map(command => command.name).join('\n'));
		const description = '**' + data;

		const ownerembed = new Discord.MessageEmbed()
			.setTitle('Owner Help Menu')
			.setColor('RANDOM')
			.setDescription(description, { split: true })
			.addField('IMPORTANT', `Some of these commands have a great effect on the bot and I suggest running \`${prefix}help [command name]\` first to find out what it does.`);
		message.react('📬');
		message.author.send ({ embeds: [ownerembed] });
	},
};