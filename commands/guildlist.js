const Discord = require('discord.js');
module.exports = {
	name: 'guildlist', // command name
	description: 'Lists all guilds the bot is in.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['serverlist'],
	execute(message) { // inside here command stuff
		const Guilds = message.client.guilds.cache.map(guild => guild.name);

		let guildlist = [];
		Guilds.forEach(element => {
			guildlist = guildlist + `${element}\n`;
		});
		const guildlistembed = new Discord.MessageEmbed()
			.setTitle(`**We are in ${Guilds.length} servers!**`)
			.setColor('RANDOM')
			.addFields(
				{ name: 'Names:', value: guildlist, inline: true },
			)
			.setDescription('Get an invite with `*fetchinvite <guild id>`.');
		message.author.send({ embeds: [guildlistembed] });
		message.react('📬');
	},
};