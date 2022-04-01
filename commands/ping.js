const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	myPermissions: ['SEND_MESSAGES'],
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency'),

	async execute(interaction) {
		try {
			await interaction.reply({ content: `🏓 Latency is ${interaction.client.ws.ping}ms`, ephemeral: true });
		}
		catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: false, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};