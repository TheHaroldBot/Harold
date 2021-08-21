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
            .setTitle('New Message!')
            .addField('Info', `From ${message.author.tag}`)
            .setColor('RANDOM')
            .addField('Description', message.content)
            if(message.guild) {
                bugreportembed.addField('From guild:', `Name: ${message.guild.name}, ID: ${message.guild.id}`)
            } else {
                bugreportembed.addField('From direct message:', 'No guild information avaliable.')
            }
            bugreportembed.addField('Contact method:', 'If this is from a guild, then do `*fetchinvite <guild id>` to get an invite to talk to them.\nAlternatively, you can send a friend request to the sender.\nIf the message is not from a guild, send a friend request to the sender.')
            dmme.send({ embeds: [bugreportembed]})
        } 
        message.channel.send('Sent! If you receive a friend request from one of the owners, they might want to talk more. As an alternantive, an owner may join your server to talk.')
	},
};