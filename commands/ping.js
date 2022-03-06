module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	myPermissions: ['SEND_MESSAGES'],
	execute(message, args, prefix, client) {
		message.reply(`🏓 API Latency is ${Math.round(client.ws.ping)}ms`);
	},
};