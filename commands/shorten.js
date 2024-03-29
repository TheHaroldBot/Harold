const fs = require('fs');
const { makeid, refreshShortUrls } = require('../functions.js');
const validUrl = require('valid-url');
const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'shorten', // command name
	description: 'Shorten a URL', // command description
	args: true, // needs arguments?
	usage: '<url>', // usage instructions w/o command name and prefix
	guildOnly: false, // execute in a guild only?
	cooldown: 60, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions required for bot
	ownerOnly: false, // need to be the owner? delete line if no
	disabled: false, // command disabled to all? delete line if no
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('shorten')
		.setDescription('Shorten a URL')
		.addStringOption(option =>
			option.setName('url')
				.setRequired(true)
				.setDescription('The URL to shorten.'),
		),

	execute(interaction) { // inside here command stuff
		if (!validUrl.isWebUri(interaction.options.getString('url'))) {
			return interaction.reply({ content: 'Invalid URL.', ephemeral: true });
		}
		const urlList = JSON.parse(fs.readFileSync('././shorturls.json'));
		let done = false;
		let id = '';
		while (!done) {
			id = makeid(5);
			if (!urlList[id]) done = true;
		}
		urlList[id] = interaction.options.getString('url');
		fs.writeFileSync('././shorturls.json', JSON.stringify(urlList, null, 4));
		refreshShortUrls();
		interaction.reply({ content: 'http://theharoldbot.com/shorts?id=' + id, ephemeral: true });
	},
};