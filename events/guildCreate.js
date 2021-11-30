const Discord = require('discord.js');
const prefix = require('../config.json').prefix;

module.exports = {
	name: 'guildCreate',
	once: true,
	async execute(guild) {
		// const prefix = require('../config.json'); //fix this
		const introembed = new Discord.MessageEmbed()
			.setTitle('Hiya!')
			.setColor('RANDOM')
			.setDescription(`Thank you for adding me to your server!\nRun \`${prefix}help\` to get my commands!\nThings to know: I am still under developement, and will have a few bugs, feel free to report them with \`${prefix}bugreport\`.\nMy GitHub can be found [here](https://github.com/johng3587/Harold).`);
		const owner = await guild.fetchOwner();
		try {
			await owner.send({ embeds: [introembed] }).catch(console.error());
		}
		catch (error) {
			console.error(`Error sending into embed to ${owner.tag} from ${guild.name}:\n${error}`);
		}
		console.info(`I just joined a new server! I am now a member of ${guild.name}`);
	},
};