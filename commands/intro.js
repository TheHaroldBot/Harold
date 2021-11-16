const Discord = require('discord.js');

module.exports = {
	name: 'intro', // command name
	description: 'Re-sends the intro message', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	aliases: ['introembed'],
	execute(message, args, prefix) { // inside here command stuff
		const introembed = new Discord.MessageEmbed()
			.setTitle('Hiya!')
			.setColor('RANDOM')
			.setDescription(`Thank you for adding me to your server!\nRun \`${prefix}help\` to get my commands!\nThings to know: I am still under developement, and will have a few bugs, feel free to report them with \`${prefix}bugreport\`\nMy GitHub can be found here: https://github.com/johng3587/Harold`);
		message.channel.send({ embeds: [introembed] });
	},
};

