module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	execute(message, args, prefix, client) {
		message.reply(`🏓 API Latency is ${Math.round(client.ws.ping)}ms`);
	},
};