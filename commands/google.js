module.exports = {
	name: 'google', // command name
	description: 'Googles stuff for you.', // command description
	args: true, // needs arguments? delete line if no
	usage: '<search query>', // usage instructions w/o command name and prefix
	cooldown: 2, // cooldown in seconds, defaults to 3
	aliases: ['search'],
	execute(message, args, prefix) { // inside here command stuff
		const googlespace = message.content.replace(`${prefix}google `, '');
		const googlenospace = googlespace.replaceAll(' ', '%20');
		message.channel.send(`https://lmgtfy.app/?q=${googlenospace}`);
	},
};