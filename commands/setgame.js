module.exports = {
	name: 'setgame', // command name
	description: 'Sets the bot\'s game.', // command description
	args: true, // needs arguments? delete line if no
	usage: '<game name>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: [],
	execute(message, args, prefix) { // inside here command stuff
		message.client.user.setActivity(message.content.replace(`${prefix}setgame `, ''));
		message.channel.send(`Game set to ${message.content.replace(`${prefix}setgame `, '')}`);
	},
};