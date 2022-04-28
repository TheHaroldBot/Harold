const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { invite } = require('../config.json');

module.exports = {
	name: 'botstats', // command name
	description: 'Get bot stats and info', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	disabled: false, // whether the command is disabled
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: ['vote'],
	data: new SlashCommandBuilder()
		.setName('botstats')
		.setDescription('Get bot stats and info'),

	execute(interaction) { // inside here command stuff
		const inviteembed = new Discord.MessageEmbed()
			.setTitle('Invite or vote here!')
			.setDescription(`🏓 Latency is ${interaction.client.ws.ping}ms\nWe are in ${interaction.client.guilds.cache.size} guilds! \nVote for me at [discordbotlist.com](https://discordbotlist.com/bots/harold)\nInvite me [here.](${invite})`)
			.setColor('RANDOM');
		interaction.reply({ embeds: [inviteembed] });
	},
};