// const Discord = require('discord.js');

const { PermissionFlagsBits } = require('discord.js');

module.exports = {
	customId: 'decorate',
	permissions: [PermissionFlagsBits.ManageChannels],
	myPermissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
	async execute(interaction) {
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
		const channelList = await interaction.guild.channels.fetch();
		if (interaction.message.interaction.user.id === interaction.user.id) {
			channelList.forEach(async element => {
				if (element.type === 'GUILD_CATEGORY') return;
				if (element.type === 'GUILD_PUBLIC_THREAD') return;
				if (element.type === 'GUILD_PRIVATE_THREAD') return;
				if (element.type === 'GUILD_STAGE_VOICE') return;
				if (element.type === 'UNKNOWN') return;
				if (interaction.values[0] === 'clear') {
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
				const theme = themes[interaction.values[0]];
				const randomemoji = theme[Math.floor(Math.random() * theme.length)];
				const newname = randomemoji + element.name + randomemoji;
				try {
					await element.setName(newname);
				}
				catch (error) {
					console.error('Could not set a channel name using decor command');
				}

			});
			interaction.update({ content: 'Decorating for ' + interaction.values, components: [] });
		}
		else {
			interaction.reply({ content: 'You did not start this command, run it yourself!', ephemeral: true });
		}

	},
};