const Discord = require('discord.js');
const fs = require("fs")
const removeFromArray = require('remove-from-array')

module.exports = {
	name: 'unblock', //command name
	description: 'Unblocks a user from using the bot', //command description
	args: true, //needs arguments? delete line if no
    usage: `<mention>`, //usage instructions w/o command name and prefix
	cooldown: 1, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
		let data = JSON.parse(fs.readFileSync('././config.json'))
    	if(!data.blocked.includes(message.mentions.users.first().id)) return(message.channel.send('That person is not blocked.'))
    	removeFromArray(data.blocked, message.mentions.users.first().id)
	    fs.writeFileSync('././config.json', JSON.stringify(data))
	    message.channel.send(`Successfully unblocked ${message.mentions.users.first().tag}.`)
	},
};
