const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { invite } = require('../config.json');

module.exports = {
	name: 'botstats', // command name
	description: 'Get bot stats, ping, invite, and other info.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	disabled: false, // whether the command is disabled
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: ['vote'],
	data: new SlashCommandBuilder()
		.setName('botstats')
		.setDescription('Get bot stats, ping, invite, and other info.'),

	execute(interaction) { // inside here command stuff
		const linkButtons = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setLabel('Vote')
					.setStyle('LINK')
					.setURL('https://top.gg/bot/808750224033185794'),
				new Discord.MessageButton()
					.setLabel('Invite')
					.setStyle('LINK')
					.setURL(invite),
			);
		const inviteembed = new Discord.MessageEmbed()
			.setTitle('Invite or vote here!')
			.setDescription(`
				🏓 Latency is ${interaction.client.ws.ping}ms
				We are in ${interaction.client.guilds.cache.size} guilds!
				Vote for me at [top.gg](https://top.gg/bot/808750224033185794)
				Invite me [here.](${invite})
			`)
			.setColor('RANDOM');
		interaction.reply({ embeds: [inviteembed], components: [linkButtons] });
	},
};