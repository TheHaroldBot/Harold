const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { invite } = require('../config.json');

module.exports = {
	name: 'botstats', // command name
	description: 'Get bot stats, ping, invite, and other info.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	disabled: false, // whether the command is disabled
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: ['vote'],
	data: new SlashCommandBuilder()
		.setName('botstats')
		.setDescription('Get bot stats, ping, invite, and other info.'),

	execute(interaction) { // inside here command stuff
		const linkButtons = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.ButtonBuilder()
					.setLabel('Vote')
					.setStyle('LINK')
					.setURL('https://top.gg/bot/808750224033185794'),
				new Discord.ButtonBuilder()
					.setLabel('Invite')
					.setStyle('LINK')
					.setURL(invite),
			);
		const inviteembed = new Discord.EmbedBuilder()
			.setTitle('Invite or vote here!')
			.setDescription(`\n🏓 Latency is ${interaction.client.ws.ping}ms\nUptime: ${process.uptime() < 3600 ? Math.round(process.uptime() / 60) + ' minutes' : Math.round((process.uptime() / 60) / 60) + ' hours'}\nI am in ${interaction.client.guilds.cache.size} guilds!\nVote for me at [top.gg](https://top.gg/bot/808750224033185794)\nInvite me [here.](${invite})
			`)
			.setColor('Random');
		interaction.reply({ embeds: [inviteembed], components: [linkButtons] });
	},
};