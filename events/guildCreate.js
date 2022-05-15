const Discord = require('discord.js');

module.exports = {
	name: 'guildCreate',
	once: true,
	async execute(guild) {
		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setLabel('GitHub')
					.setStyle('LINK')
					.setEmoji('<:ghub:971219159088250900>')
					.setURL('https://github.com/johng3587/Harold'),
				new Discord.MessageButton()
					.setLabel('Vote')
					.setStyle('LINK')
					.setEmoji('⭐')
					.setURL('https://discordbotlist.com/bots/harold'),
			);
		const introembed = new Discord.MessageEmbed()
			.setTitle('Hiya!')
			.setColor('RANDOM')
			.setDescription(`
				Thank you for adding me to your server!
				Run \`/help\` to get my commands!
				Things to know: I am still under developement, and will have a few bugs, feel free to report them with \`/bugreport\`.
				I collect anonymous usage data to help me improve my features.
			`);
		const owner = await guild.fetchOwner();
		try {
			await owner.send({ embeds: [introembed], components: [row] });
		}
		catch (error) {
			console.error(`
				Error sending into embed to user ${owner.id} from server ${guild.id}:
				${error}
			`);
		}
		console.info(`I just joined a new server! I am now a member of ${guild.name}`);
	},
};