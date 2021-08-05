const Discord = require('discord.js');

module.exports = {
	name: 'args-info', //command name
	description: 'Information about the arguments provided.', //command description
	args: true, //needs arguments? delete line if no
    usage: `<args>`, //usage instructions w/o command name and prefix
    guildOnly: true, //execute in a guild only? remove line if no
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: ['KICK_MEMBERS', 'BAN_MEMBERS'], //permissions required for command
	ownerOnly: true, //need to be the owner? delete line if no
	disabled: true, //command disabled to all? delete line if no
	aliases: ['args', 'arguments', 'argument-info', 'arguments-info'],
	execute(message, args, prefix) { //inside here command stuff
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};