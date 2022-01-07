const Discord = require('discord.js');

module.exports = {
	name: 'bugreport',
	description: 'Report a bug to the developer.',
	args: true,
	usage: '<message>',
	cooldown: 60,
	aliases: ['messagedevs', 'telldevs', 'suggest'],
	execute(message, args, prefix) {
		const bugreportembed = new Discord.MessageEmbed()
			.setTitle('New Message!')
			.addField('Info', `From ${message.author.tag}`)
			.setColor('RANDOM')
			.addField('Description', args.join(' '));
		if (message.guild) {
			bugreportembed.addField('From guild:', `Name: ${message.guild.name}, ID: ${message.guild.id}\nUser ID: ${message.author.id}`);
		}
		else {
			bugreportembed.addField('From direct message:', `No guild information avaliable.\nUser ID: ${message.author.id}`);
		}
		bugreportembed.addField('Contact method:', `You can send a friend request to the sender, or talk through harold with \`${prefix}message\`.`);
		const supportchannel = message.client.channels.cache.get('905621722978467860');
		supportchannel.send({ embeds: [bugreportembed] });
		message.reply('Sent! If you receive a friend request from one of the owners, they might want to talk more. As an alternantive, an owner may talk through Harold.');
	},
};
