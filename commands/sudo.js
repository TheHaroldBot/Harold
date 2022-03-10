const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient } = require('discord.js');

module.exports = {
	name: 'sudo', // command name
	description: 'Immitate people', // command description
	args: true, // needs arguments? delete line if no
	usage: '<mention> <message>', // usage instructions w/o command name and prefix
	guildOnly: true, // execute in a guild only? remove line if no
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES', 'MANAGE_WEBHOOKS'], // permissions bot needs for command
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('sudo')
		.setDescription('Immitate people')
		.addMentionableOption(option =>
			option.setName('mention')
				.setRequired(true)
				.setDescription('The user to immitate.'))
		.addStringOption(option =>
			option.setName('message')
				.setRequired(true)
				.setDescription('The message to send as the mentioned person.')),

	execute(message, args) { // inside here command stuff
		message.channel.createWebhook('Snek', {
			reason: 'Temp webhook for sudo command',
		})
			.then(webhook => {
				try {
					const webhookto = new WebhookClient({ token: webhook.token, id: webhook.id });
					args.shift();
					webhookto.send({
						username: message.mentions.users.first().username,
						avatarURL: message.mentions.users.first().avatarURL(),
						content: args.join(' '),
					});
					webhook.delete();
				}
				catch (error) {
					console.error();
					message.reply('Error running that command, this channel might have reached the maximum number of webhooks (10)');
				}

			});
		message.delete();

	},
};