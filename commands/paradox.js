module.exports = {
	name: 'paradox', // command name
	description: 'Gives you a paradox.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 2, // cooldown in seconds, defaults to 3
	aliases: [],
	execute(message) { // inside here command stuff
		message.channel.send('The next sentence is false.\nThe previous sentence is true');
	},
};