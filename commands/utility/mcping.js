const Discord = require('discord.js');
const util = require('minecraft-server-util');

module.exports = {
	name: 'mcping', //command name
	description: 'Pings a minecraft server', //command description
	args: true, //needs arguments? delete line if no
    usage: `<Java server ip and port>`, //usage instructions w/o command name and prefix
	cooldown: 10, //cooldown in seconds, defaults to 3
	aliases: ['pingmc'],
	execute(message, args, prefix) { //inside here command stuff
		util.status(args[0]) //pings a minecraft server
		.then((response) => {
			const mcpingembed = new Discord.MessageEmbed()
			.setTitle(args[0])
			.setDescription(`**Online players:** ${response.onlinePlayers}/${response.maxPlayers}\n**Server version:** ${response.version}\n**Latency:** ${response.roundTripLatency}ms\n**Motd:** ${response.description.descriptionText}`)
			.setThumbnail('https://media.minecraftforum.net/attachments/300/619/636977108000120237.png')
			.setColor('#0ffc03')
			message.channel.send(mcpingembed).catch((err) => {
				console.log(err)
				message.channel.send('Error sending embed')
			})
		})
		.catch((error) => {
			console.log(error)
			const mcpingembed = new Discord.MessageEmbed()
			.setTitle(args[0])
			.setDescription(`**Online players:** server offline\n**Server version:** server offline\n**Latency:** server offline\n**Motd:** server offline`)
			.setThumbnail('https://www.freepnglogos.com/uploads/warning-sign-png/warning-sign-red-png-17.png')
			.setColor('#fc0303')
			message.channel.send(mcpingembed).catch((err) => {
				console.log(err)
				message.channel.send('Error sending embed.')
			})
		})
	},
};