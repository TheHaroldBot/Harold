module.exports = {
	name: 'setstream', // command name
	description: 'Sets the bot\'s streaming status.', // command description
	usage: '<url> <name>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['stream'],
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