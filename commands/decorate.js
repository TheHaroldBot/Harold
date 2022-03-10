const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json');
const options = ['summer', 'fall', 'winter', 'spring', 'christmas', 'halloween', 'easter', 'hanukkah', 'clear'];

module.exports = {
	name: 'decorate', // command name
	description: `Decorate channels. Run \`${config.prefix}decor clear\` first if you already have emojis on it to clear them. Due to Discord rate limiting, this command can only be run once every 5 minutes.\nIf you bypass this rate limit by using multiple people, note that it will work, but it will be delayed.`, // command description
	args: true, // needs arguments? delete line if no
	usage: `<${options.join('|')}>`, // usage instructions w/o command name and prefix
	guildOnly: true, // execute in a guild only? remove line if no
	cooldown: 300, // cooldown in seconds, defaults to 3
	permissions: ['MANAGE_CHANNELS'], // permissions required for command
	myPermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'], // permissions bot needs for command
	aliases: ['decor'],
	data: new SlashCommandBuilder()
		.setName('decorate')
		.setDescription('Decorate channels with fancy emojis!')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('The theme of the decorations, or clear')
				.setRequired(true)
				.addChoices([
					['summer', 'summer'],
					['fall', 'fall'],
					['winter', 'winter'],
					['spring', 'spring'],
					['christmas', 'christmas'],
					['halloween', 'halloween'],
					['easter', 'easter'],
					['hanukkah', 'hanukkah'],
					['clear', 'clear'],
				])),

	async execute(interaction) { // inside here command stuff
		interaction.reply({ content: 'Working on it!' });
		const themes = {
			summer: ['🌴', '🏝️', '🕶️', '⛱️', '🦩'],
			fall: ['🍂', '🌰', '☕', '🥧', '🎑', '🍁', '🌽'],
			winter: ['❄️', '⛄', '🧣', '🎿', '🥶'],
			spring: ['🌻', '🌼', '🌷', '🌾', '🌈', '🍃'],
			christmas: ['🎅', '🤶', '🧝', '🌟', '🎄', '🕯️', '🦌'],
			halloween: ['🕸️', '🕷️', '🦇', '🎃', '⚰️', '🧛', '👻'],
			easter: ['🐇', '🍫', '🐤', '🥚', '🥕', '🔔'],
			hanukkah: ['🕎', '✡️', '🕍', '🕯️'],
			/* other seasons here */
		};
		const allemojis = themes.summer.concat(themes.fall, themes.winter, themes.spring, themes.christmas, themes.halloween, themes.easter, themes.hanukkah);
		if (!options.includes(interaction.options.getString('type'))) return (interaction.editReply({ content: `Usage: /${this.name} ${this.usage}`, ephemeral: true }));
		const channelList = await interaction.guild.channels.fetch();
		channelList.forEach(async element => {
			if (element.type === 'GUILD_CATEGORY') return;
			if (element.type === 'GUILD_PUBLIC_THREAD') return;
			if (element.type === 'GUILD_PRIVATE_THREAD') return;
			if (element.type === 'GUILD_STAGE_VOICE') return;
			if (element.type === 'UNKNOWN') return;
			if (interaction.options.getString('type') === 'clear') {
				let name = element.name;
				allemojis.forEach(emoji => {
					name = name.replace(emoji, '');
					name = name.replace(emoji, '');
				});
				try {
					await element.setName(name, 'Removed decoration');
				}
				catch (error) {
					console.error('Could not set a channel name using decor command');
				}
				return;
			}
			const theme = themes[interaction.options.getString('type')];
			const randomemoji = theme[Math.floor(Math.random() * theme.length)];
			const newname = randomemoji + element.name + randomemoji;
			try {
				await element.setName(newname);
			}
			catch (error) {
				console.error('Could not set a channel name using decor command');
			}

		});
	},
};
