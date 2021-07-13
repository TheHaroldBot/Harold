const Discord = require('discord.js');
const fs = require("fs")

module.exports = {
	name: 'bugreport',
	description: 'Report a bug to the developer.',
	args: true,
    usage: `<message>`,
	cooldown: 0,
	aliases: ['messagedevs', 'telldevs', 'dmdevs'],
	execute(message, args, prefix) {
        const ownerinfo = fs.readFileSync('././config.json')
        const ownerid = JSON.parse(ownerinfo)
		for (let i = 0; i < ownerid.ownerid.length; i++) {
            const dmme = message.client.users.cache.get(ownerid.ownerid[i])
            const bugreportembed = new Discord.MessageEmbed()
            .setTitle('New bug report!')
            .addField('Info', `From ${message.author.tag}`)
            .setColor('RANDOM')
            .addField('Description', message.content.replace(`${prefix}bugreport `, ""))
            dmme.send(bugreportembed)
            message.channel.send('Sent!')
        } 
	},
};