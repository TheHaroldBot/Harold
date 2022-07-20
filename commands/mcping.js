const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const util = require('minecraft-server-util');

module.exports = {
	name: 'mcping', // command name
	description: 'Pings a minecraft server', // command description
	args: true, // needs arguments? delete line if no
	usage: '<bedrock|java> <IP> [port]', // usage instructions w/o command name and prefix
	cooldown: 10, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	aliases: ['pingmc'],
	data: new SlashCommandBuilder()
		.setName('mcping')
		.setDescription('Pings a minecraft server')
		.addStringOption(option =>
			option.setName('type')
				.setRequired(true)
				.setDescription('The type of server to ping.')
				.addChoices(
					{
						name: 'bedrock',
						value: 'bedrock',
					},
					{
						name: 'java',
						value: 'java',
					},
				))
		.addStringOption(option =>
			option.setName('ip')
				.setRequired(true)
				.setDescription('The IP of the server.'))
		.addNumberOption(option =>
			option.setName('port')
				.setRequired(false)
				.setDescription('The port of the server.')),


	async execute(interaction) { // inside here command stuff
		await interaction.deferReply();
		const type = interaction.options.getString('type').toLowerCase();
		const ip = interaction.options.getString('ip');
		let pingport = 0;
		if (!interaction.options.getNumber('port')) {
			if (type === 'bedrock') {
				pingport = 19132;
			}
			else if (type === 'java') {
				pingport = 25565;
			}
		}
		else {
			pingport = parseFloat(interaction.options.getNumber('port'));
		}

		if (type === 'java') {
			util.status(ip, pingport) // pings a minecraft server
				.then(async (response) => {
					const mcpingembed = new Discord.EmbedBuilder()
						.setTitle(ip)
						.setDescription(`\n**Online players:** ${response.players.online}/${response.players.max}\n**Server version:** ${response.version.name}\n**Latency:** ${response.roundTripLatency}ms\n**Motd:** ${response.motd.clean}`)
						.setThumbnail('https://media.minecraftforum.net/attachments/300/619/636977108000120237.png')
						.setColor('#0ffc03');
					try {
						await interaction.editReply({ embeds: [mcpingembed] });
					}
					catch (error) {
						const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
						throw returnError;
					}
				})
				.catch(async () => {
					const mcpingembed = new Discord.EmbedBuilder()
						.setTitle(ip)
						.setDescription('**Online players:** Cannot connect to server\n**Server version:** Cannot connect to server\n**Latency:** Cannot connect to server\n**Motd:** Cannot connect to server')
						.setThumbnail('https://www.freepnglogos.com/uploads/warning-sign-png/warning-sign-red-png-17.png')
						.setColor('#fc0303');
					try {
						await interaction.editReply({ embeds: [mcpingembed] });
					}
					catch (error) {
						const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
						throw returnError;
					}
					return;
				});
		}
		else if (type === 'bedrock') {
			util.statusBedrock(ip, pingport) // pings a minecraft server
				.then(async (response) => {
					const mcpingembed = new Discord.EmbedBuilder()
						.setTitle(ip)
						.setDescription(`**Online players:** ${response.players.online}/${response.players.max}\n**Latency:** unknown\n**Motd:** ${response.motd.clean}`)
						.setThumbnail('https://media.minecraftforum.net/attachments/300/619/636977108000120237.png')
						.setColor('#0ffc03');
					try {
						await interaction.editReply({ embeds: [mcpingembed] });
					}
					catch (error) {
						const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
						throw returnError;
					}
				})
				.catch(async () => {
					const mcpingembed = new Discord.EmbedBuilder()
						.setTitle(ip)
						.setDescription('**Online players:** Cannot connect\n**Server version:** Cannot connect to server\n**Latency:** Cannot connect to server\n**Motd:** Cannot connect to server')
						.setThumbnail('https://www.freepnglogos.com/uploads/warning-sign-png/warning-sign-red-png-17.png')
						.setColor('#fc0303');
					try {
						await interaction.editReply({ embeds: [mcpingembed] });
					}
					catch (error) {
						const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
						throw returnError;
					}
					return;
				});
		}
	},
};