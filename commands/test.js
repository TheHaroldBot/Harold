/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-function */
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
	name: 'test', // command name
	description: 'Test bits of code here', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 1, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	ownerOnly: true, // need to be the owner? delete line if no
	disabled: true,
	aliases: [],
	execute(message, args, prefix) {

	},
};