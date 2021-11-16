module.exports = {
	name: 'thiscommandliterallydoesnothing', // command name
	description: 'Nothing', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 1, // cooldown in seconds, defaults to 3
	aliases: [],
	execute() { // inside here command stuff
		return;
	},
};