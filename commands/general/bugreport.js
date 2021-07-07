const Discord = require('discord.js');

module.exports = {
	name: 'bugreport',
	description: 'Report a bug to the developer.',
	args: true,
    disabled: true,
    usage: `<message>`,
	cooldown: 60,
	aliases: [],
	execute(message, args, prefix, ownerid) {
		for (let i = 0; i < ownerid.length; i++) {
            const dmme = message.client.users.cache.get(ownerid[i])
            const bugreportembed = new Discord.MessageEmbed()
            .setTitle('New bug report!')
            .addField('Info', `From ${message.author.tag}`)
            .addField('Description', message.content.replace(`${prefix}bugreport `, ""))
            dmme.send(bugreportembed)
            message.channel.send('Sent!')
        } 
	},
};