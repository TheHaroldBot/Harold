const Discord = require('discord.js');
const fs = require("fs")

module.exports = {
	name: 'bugreport',
	description: 'Report a bug to the developer.',
	args: true,
    usage: `<message>`,
	cooldown: 60,
	aliases: ['messagedevs', 'telldevs', 'dmdevs'],
	execute(message, args, prefix) {
        const configraw = fs.readFileSync('././config.json')
        const config = JSON.parse(configraw)
		for (let i = 0; i < config.ownerids.length; i++) {
            const dmme = message.client.users.cache.get(config.ownerids[i])
            const bugreportembed = new Discord.MessageEmbed()
            .setTitle('New bug report!')
            .addField('Info', `From ${message.author.tag}`)
            .setColor('RANDOM')
            .addField('Description', message.content)
            dmme.send(bugreportembed)
        } 
        message.channel.send('Sent! If you receive a friend request from one of the owners, they might want to talk more.')
	},
};