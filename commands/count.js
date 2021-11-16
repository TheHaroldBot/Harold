module.exports = {
	name: 'count', // command name
	description: 'Gets server member count.', // command description
	usage: '', // usage instructions w/o command name and prefix
	guildOnly: true, // execute in a guild only? remove line if no
	cooldown: 1, // cooldown in seconds, defaults to 3
	aliases: ['members', 'membercount'],
	execute(message) { // inside here command stuff
		message.channel.send(`Current member count: ${message.guild.memberCount}`); // gives server member count
	},
};