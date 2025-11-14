const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'mcping', // command name
	description: 'Pings a minecraft server', // command description
	args: true, // needs arguments? delete line if no
	usage: '<bedrock|java> <IP> [port]', // usage instructions w/o command name and prefix
	cooldown: 10, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	data: new SlashCommandBuilder()
		.setName('mcping')
		.setDescription('Pings a minecraft server')
		.addStringOption(option =>
			option.setName('type')
				.setRequired(true)
				.setDescription('The type of server to ping.')
				.addChoices(
					{
						name: 'java',
						value: 'java',
					},
					{
						name: 'bedrock',
						value: 'bedrock',
					},
				))
		.addStringOption(option =>
			option.setName('ip')
				.setRequired(true)
				.setDescription('The IP of the server.'))
		.addIntegerOption(option =>
			option.setName('port')
				.setRequired(false)
				.setMinValue(1)
				.setMaxValue(65535)
				.setDescription('The port of the server.')),


	async execute(interaction) { // inside here command stuff
		await interaction.deferReply();
		const type = interaction.options.getString('type').toLowerCase();
		const ip = interaction.options.getString('ip');
		let port = null;

		if (interaction.options.getNumber('port')) {
			port = interaction.options.getNumber('port');
		} else if (type === 'java') {
			port = 25565;
		} else {
			port = 19132;
		}

		let mcpingembed = null;
		if (type == 'java') {
			await fetch(`https://api.mcstatus.io/v2/status/java/${ip}:${port}`, { method: 'Get' })
				.then((res) => res.json())
				.then((res) => {
					if (res.online) {
						mcpingembed = new EmbedBuilder()
							.setTitle(res.host)
							.setDescription(`
							**Online players:** ${res.players.online}/${res.players.max}
							**Server version:** ${res.version.name_clean}
							**EULA Blocked:** ${res.eula_blocked ? 'Yes' : 'No'}
							**Motd:** ${res.motd.clean}`)
							.setFooter({ text: `Hostname: ${res.host}, Port: ${res.port}` })
							.setThumbnail(`https://api.mcstatus.io/v2/icon/${ip}`)
							.setColor('#0ffc03');
					} else {
						mcpingembed = new EmbedBuilder()
							.setTitle(ip)
							.setDescription('The server is offline or unreachable.')
							.setThumbnail('https://media.minecraftforum.net/attachments/300/619/636977108000120237.png')
							.setColor('#ff0000');
					}
				});

		} else if (type == 'bedrock') {
			await fetch(`https://api.mcstatus.io/v2/status/bedrock/${ip}:${port}`, { method: 'Get' })
				.then(res => res.json())
				.then(res => {
					if (res.online) {
						mcpingembed = new EmbedBuilder()
							.setTitle(res.host)
							.setDescription(`
							**Online players:** ${res.players.online}/${res.players.max}
							**Server version:** ${res.version.name}
							**Gamemode:** ${res.gamemode}
							**EULA Blocked:** ${res.eula_blocked ? 'Yes' : 'No'}
							**Motd:** ${res.motd.clean}`)
							.setFooter({ text: `Hostname: ${data.host}, Port: ${res.port}` })
							.setThumbnail(`https://api.mcstatus.io/v2/icon/${ip}`)
							.setColor('#0ffc03');
					} else {
						mcpingembed = new EmbedBuilder()
							.setTitle(ip)
							.setDescription('The server is offline or unreachable.')
							.setThumbnail('https://media.minecraftforum.net/attachments/300/619/636977108000120237.png')
							.setColor('#ff0000');
					}
				});

		} else {
			// Shouldn't be possible.
			throw new error('Invalid type specified.');
		}

		try {
			await interaction.editReply({ embeds: [mcpingembed] });
		} catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};