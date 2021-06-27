const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'log', //command name
	description: "Logs something to the console.", //command description
	args: true, //needs arguments? delete line if no
    usage: `<log message>`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: [],
	execute(message, args, prefix, user) { //inside here command stuff
		const logcontent = message.content
		console.log('\x1b[32m\x1b[4m\x1b[1m%s', `Custom log: ${message.content.replace(`${prefix}log `, "")}`);
		message.channel.send('Message logged!')
	},
};