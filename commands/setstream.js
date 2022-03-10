const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'setstream', // command name
	description: 'Sets the bot\'s streaming status.', // command description
	usage: '<url> <name>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['stream'],
	data: new SlashCommandBuilder()
		.setName('setstream')
		.setDescription('Sets the bot\'s streaming status.')
		.addStringOption(option =>
			option.setName('url')
				.setRequired(true)
				.setDescription('The stream url.'))
		.addStringOption(option =>
			option.setName('name')
				.setRequired(true)
				.setDescription('The stream name.')),

	execute(message, args, prefix) { // inside here command stuff
		if (args.length < 2) {
			message.reply('You need to set a stream title *and* a url');
			return;
		}
		else {
			message.client.user.setActivity(message.content.replace(`${prefix}setstream ${args[0]}`, ''), {
				type: 'STREAMING',
				url: args[0],
			});
			message.reply(`Streaming ${message.content.replace(`${prefix}setstream ${args[0]}`, '')} at \`${args[0]}\``);
		}
	},
};