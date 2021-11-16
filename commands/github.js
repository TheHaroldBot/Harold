module.exports = {
	name: 'github', // command name
	description: 'Get the GitHub website for Harold.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	aliases: ['git'],
	execute(message) { // inside here command stuff
		message.reply('https://github.com/johng3587/Harold');
	},
};