const Discord = require('discord.js');

module.exports = {
	name: 'guildCreate',
	once: true,
	async execute(guild) {
		const introembed = new Discord.MessageEmbed()
			.setTitle('Hiya!')
			.setColor('RANDOM')
			.setDescription(`
				Thank you for adding me to your server!
				Run \`/help\` to get my commands!
				Things to know: I am still under developement, and will have a few bugs, feel free to report them with \`/bugreport\`.
				My GitHub can be found [here](https://github.com/johng3587/Harold).
			`);
		const owner = await guild.fetchOwner();
		try {
			await owner.send({ embeds: [introembed] });
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