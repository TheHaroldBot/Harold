const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'newsletter', // command name
	description: 'Send a newsletter to all the server owners the bot is in. DO NOT USE THIS LIGHTLY!', // command description
	args: true, // needs arguments? delete line if no
	usage: '<message>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['news'],
	async execute(message, args) { // inside here command stuff
		let ownersendcount = 0;
		let guildsendcount = 0;
		const guilds = message.client.guilds.cache.map(guild => guild);
		const description = args.join(' ');
		const newsembed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('You\'ve got mail!')
			.setDescription(description)
			.setAuthor(`From: ${message.author.username}`, message.author.displayAvatarURL(), 'https://discord.gg/xnY4SZV2Cd')
			.setTimestamp();

		config.ownerids.forEach(async ownerid => {
			const dmme = message.client.users.cache.get(ownerid);
			newsembed.setFooter('Sent because you are an owner of Harold.');
			try {
				await dmme.send({ embeds: [newsembed] });
				console.log(`News embed sent to ${dmme.tag}`);
			}
			catch (error) {
				console.error(`Error sending news embed to ${dmme.tag}!`);
			}
			ownersendcount++;
		});

		guilds.forEach(async guild => {
			const owner = await guild.fetchOwner();
			try {
				newsembed.setFooter(`Sent because you are the owner of ${guild.name}`);
				await owner.send({ embeds: [newsembed] });
				console.log(`News embed sent to ${owner.tag} from ${guild.name}`);
			}
			catch (error) {
				console.error(`Error sending news embed to ${owner.tag} from ${guild.name}`);
			}
			guildsendcount++;
		});
		const announcementChannel = message.guild.channels.cache.find('875779429618565120');
		announcementChannel.send({ embeds: [newsembed] });
		message.reply(`Sent to ${guildsendcount} guild and ${ownersendcount} bot owners.`, { embeds: [newsembed] });
		message.react('📬');
	},
};