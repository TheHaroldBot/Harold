const Discord = require('discord.js');

module.exports = {
	name: 'eval', //command name
	description: 'Evaluate a string into code and run it.', //command description
	args: true, //needs arguments? delete line if no
    usage: `<code>`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: ['run', 'code', 'script'],
	execute(message, args, prefix) { //inside here command stuff
		const code = args.join(" ");
        try {
            eval(code);
        } catch (error) {
            console.error(error);
            message.channel.send('Thats an error there buddy!')
        }
	},
};