const Discord = require('discord.js');
const fs = require("fs")

module.exports = {
	name: 'test', //command name
	description: 'Test bits of code here', //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: 1, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
    disabled: true,
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
        
	},
};