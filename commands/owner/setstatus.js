const Discord = require('discord.js');

module.exports = {
	name: 'setstatus', //command name
	description: "Sets the bot's presence.", //command description
	args: true, //needs arguments? delete line if no
    usage: `<online|invisible|dnd|idle>`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: [],
	execute(message, args, prefix, user) { //inside here command stuff
		if (args[0] === 'online') {
            message.client.user.setPresence({ status: 'online' })
            message.channel.send(`Status set to ${args[0]}`)
        } else if (args[0] === 'idle') {
            message.client.user.setPresence({ status: 'idle' })
            message.channel.send(`Status set to ${args[0]}`)
        } else if (args[0] === 'invisible') {
            message.client.user.setPresence({ status: 'invisible' })
            message.channel.send(`Status set to ${args[0]}`)
        } else if (args[0] === 'dnd') {
            message.client.user.setPresence({ status: 'dnd' })
            message.channel.send(`Status set to ${args[0]}`)
        } else {
            message.channel.send(`Invalid argument: ${args[0]}. Valid arguments are:\nonline, idle, invisible, dnd`)
        }
	},
};