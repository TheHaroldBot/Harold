const Discord = require('discord.js');
const util = require('minecraft-server-util');

module.exports = {
	name: 'mcping', // command name
	description: 'Pings a minecraft server', // command description
	args: true, // needs arguments? delete line if no
	usage: '<bedrock|java> <IP> [port]', // usage instructions w/o command name and prefix
	cooldown: 10, // cooldown in seconds, defaults to 3
	aliases: ['pingmc'],
	execute(message, args) { // inside here command stuff
		if (args.length < 2) return (message.reply(`You need at least 2 arguments! Usage: ${this.usage}`));
		const type = args[0].toLowerCase();
		const ip = args[1];
		let pingport = 0;
		if (!args[2]) {
			if (type === 'bedrock') {
				pingport = 19132;
			}
			else if (type === 'java') {
				pingport = 25565;
			}
		}
		else {
			pingport = parseFloat(args[2]);
		}

		if (type === 'java') {
			util.status(ip, { port: pingport }) // pings a minecraft server
				.then((response) => {
					const mcpingembed = new Discord.MessageEmbed()
						.setTitle(ip)
						.setDescription(`**Online players:** ${response.onlinePlayers}/${response.maxPlayers}\n**Server version:** ${response.version}\n**Latency:** ${response.roundTripLatency}ms\n**Motd:** ${response.description.descriptionText}`)
						.setThumbnail('https://media.minecraftforum.net/attachments/300/619/636977108000120237.png')
						.setColor('#0ffc03');
					message.reply({ embeds: [mcpingembed] }).catch((err) => {
						console.log(err);
						message.reply('Error sending embed');
					});
				})
				.catch(() => {
					const mcpingembed = new Discord.MessageEmbed()
						.setTitle(ip)
						.setDescription('**Online players:** Cannot connect to server\n**Server version:** Cannot connect to server\n**Latency:** Cannot connect to server\n**Motd:** Cannot connect to server')
						.setThumbnail('https://www.freepnglogos.com/uploads/warning-sign-png/warning-sign-red-png-17.png')
						.setColor('#fc0303');
					message.reply({ embeds: [mcpingembed] }).catch((err) => {
						console.log(err);
						message.reply('Error sending embed.');
					});
					return;
				});
		}
		else if (type === 'bedrock') {
			util.query(ip, { port: pingport }) // pings a minecraft server
				.then((response) => {
					const mcpingembed = new Discord.MessageEmbed()
						.setTitle(ip)
						.setDescription(`**Online players:** ${response.onlinePlayers}/${response.maxPlayers}\n**Latency:** ${response.roundTripLatency}ms\n**Motd:** ${response.description.descriptionText}`)
						.setThumbnail('https://media.minecraftforum.net/attachments/300/619/636977108000120237.png')
						.setColor('#0ffc03');
					message.reply({ embeds: [mcpingembed] }).catch((err) => {
						console.log(err);
						message.reply('Error sending embed');
					});
				})
				.catch((error) => {
					console.log(error);
					const mcpingembed = new Discord.MessageEmbed()
						.setTitle(ip)
						.setDescription('**Online players:** Cannot connect\n**Server version:** Cannot connect to server\n**Latency:** Cannot connect to server\n**Motd:** Cannot connect to server')
						.setThumbnail('https://www.freepnglogos.com/uploads/warning-sign-png/warning-sign-red-png-17.png')
						.setColor('#fc0303');
					message.reply({ embeds: [mcpingembed] }).catch((err) => {
						console.log(err);
						message.reply('Error sending embed.');
					});
					return;
				});
		}
		else {return (message.reply(`Incorrect usage! Usage: ${this.usage}`));}

	},
};