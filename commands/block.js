const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const removeFromArray = require('remove-from-array');

module.exports = {
	name: 'block', // command name
	description: 'Blocks a user from using the bot', // command description
	args: true, // needs arguments? delete line if no
	usage: '<add|remove> <mention>', // usage instructions w/o command name and prefix
	cooldown: 1, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('block')
		.setDescription('Blocks or unblocks a user from using the bot.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('Whether to block or unblock the user.')
				.setRequired(true)
				.addChoice('add', 'add')
				.addChoice('remove', 'add'))
		.addMentionableOption(option =>
			option.setName('user')),

	execute(message, args, prefix) { // inside here command stuff
		if (args.length < 2) return message.reply(`You need to specify an action and a user to block! \`${prefix}${this.name} ${this.usage}\``);
		if (args[0] === 'add') {
			const data = JSON.parse(fs.readFileSync('././config.json'));
			if (data.blocked.includes(message.mentions.users.first().id)) return (message.reply('That person is already blocked.'));
			data.blocked.push(message.mentions.users.first().id);
			fs.writeFileSync('././config.json', JSON.stringify(data));
			message.reply(`Successfully blocked ${message.mentions.users.first().tag}.`);
		}
		else if (args[0] === 'remove') {
			const data = JSON.parse(fs.readFileSync('././config.json'));
			if (!data.blocked.includes(message.mentions.users.first().id)) return (message.reply('That person is not blocked.'));
			removeFromArray(data.blocked, message.mentions.users.first().id);
			fs.writeFileSync('././config.json', JSON.stringify(data));
			message.reply(`Successfully unblocked ${message.mentions.users.first().tag}.`);
		}
	},
};