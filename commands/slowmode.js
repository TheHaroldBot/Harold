module.exports = {
	name: 'slowmode', // command name
	description: 'Sets the slowmode for a channel.', // command description
	args: true, // needs arguments? delete line if no
	usage: '<slowmode in seconds>', // usage instructions w/o command name and prefix
	guildOnly: true, // execute in a guild only? remove line if no
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: ['MANAGE_CHANNELS'], // permissions required for command
	aliases: ['slow', 'messagerate'],
	execute(message, args) { // inside here command stuff
		message.channel.setRateLimitPerUser(args[0], `${message.author.tag} requested a slowmode of ${args[0]} second(s) in #${message.channel.name}`);
		message.channel.send(`Success! Slowmode set to ${args[0]} second(s).`);
	},
};