const Discord = require('discord.js');
const config = require('../config.json')
const options = ['summer', 'fall', 'winter', 'spring', 'christmas', 'halloween', 'easter', 'hanukkah', 'clear']

module.exports = {
	name: 'decorate', //command name
	description: `Decorate channels. Run \`${config.prefix}decor clear\` first if you already have emojis on it to clear them. Due to Discord rate limiting, this command can only be run once every 5 minutes.\nIf you bypass this rate limit by using multiple people, note that it will work, but it will be delayed.`, //command description
	args: true, //needs arguments? delete line if no
    usage: `<${options.join('|')}>`, //usage instructions w/o command name and prefix
    guildOnly: true, //execute in a guild only? remove line if no
	cooldown: 300, //cooldown in seconds, defaults to 3
	permissions: ['MANAGE_CHANNELS'], //permissions required for command
	aliases: ['decor'],
	async execute(message, args, prefix) { //inside here command stuff
		let themes = {
			summer: ['🌴', '🏝️', '🕶️', '⛱️', '🦩'],
			fall: ['🍂', '🌰', '☕', '🥧', '🎑', '🍁', '🌽'],
			winter: ['🏔️', '🌲', '❄️', '⛄', '🧣'],
			spring: ['🌻', '🌼', '🌷', '🌾', '🌈', '🍃'],
			christmas: ['🎅', '🤶', '🧝', '🌟', '🎄', '🕯️', '🦌'],
			halloween: ['🕸️', '🕷️', '🦇', '🎃', '⚰️', '🧛', '👻'],
			easter: ['🐇', '🍫', '🐤', '🥚', '🥕', '🔔'],
			hanukkah: ['🕎', '✡️', '🕍', '🕯️']
			/* other seasons here */
		};
		let allemojis = themes.summer.concat(themes.fall, themes.winter, themes.spring, themes.christmas, themes.halloween, themes.easter, themes.hanukkah)
        if(!options.includes(args[0])) return(message.reply(`Usage: ${prefix}${this.name} ${this.usage}`))
		let channelList = await message.guild.channels.fetch()
		if(!message.guild.me.permissions.has("ADMINISTRATOR")) {
			message.reply('This command requires a permission to run, however I do not know what that permission may be. For now, I ask for administrator until I do know which permission I need, you are welcome to remove it after channels have been decorated.')
			return
		}
		channelList.forEach(element => {
			if(element.type === 'GUILD_CATEGORY') return
			if(element.type === 'GUILD_PUBLIC_THREAD') return
			if(element.type === 'GUILD_PRIVATE_THREAD') return
			if(element.type === 'GUILD_STAGE_VOICE') return
			if(element.type === 'UNKNOWN') return
			if(args[0] === 'clear') {
				let name = element.name
				allemojis.forEach(emoji => {
					name = name.replace(emoji, '')
					name = name.replace(emoji, '')
				});
				element.setName(name, 'Removed decoration')
				return
			}
			let theme = themes[args[0]]
			let randomemoji = theme[Math.floor(Math.random() * theme.length)]
			let newname = randomemoji + element.name + randomemoji
			element.setName(newname)
		});
		message.reply('Decorated!')
	},
};
