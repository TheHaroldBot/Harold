const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	myPermissions: ['SEND_MESSAGES'],
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency'),

	execute(message, args, prefix, client) {
		message.reply(`🏓 API Latency is ${Math.round(client.ws.ping)}ms`);
	},
};