const Discord = require('discord.js');
const fs = require("fs")

module.exports = {
	name: 'block', //command name
	description: 'Blocks a user from using the bot', //command description
	args: true, //needs arguments? delete line if no
    usage: `<mention>`, //usage instructions w/o command name and prefix
	cooldown: 1, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
		let data = JSON.parse(fs.readFileSync('././blocked.json'))
    	if(data.blocked.includes(message.mentions.users.first().id)) return(message.channel.send('That person is already blocked.'))
    	data.blocked.push(message.mentions.users.first().id)
    	fs.writeFileSync('././blocked.json', JSON.stringify(data))
    	message.channel.send(`Successfully blocked ${message.mentions.users.first().tag}.`)
	},
};