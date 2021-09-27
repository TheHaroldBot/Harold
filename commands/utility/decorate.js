const Discord = require('discord.js');
const prefix = require('../../config.json')

module.exports = {
	name: 'decorate', //command name
	description: `Decorate channels. Run \`${prefix}decor clear\` first if you already have emojis on it to clear them. Due to Discord rate limiting, this command can only be run once every 10 minutes.`, //command description
	args: true, //needs arguments? delete line if no
    usage: `<summer|fall|winter|spring|christmas|halloween|easter|clear>`, //usage instructions w/o command name and prefix
    guildOnly: true, //execute in a guild only? remove line if no
	cooldown: 300, //cooldown in seconds, defaults to 3
	permissions: ['MANAGE_CHANNELS'], //permissions required for command
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: ['decor'],
	async execute(message, args, prefix) { //inside here command stuff
		let options = ['summer', 'fall', 'winter', 'spring', 'christmas', 'halloween', 'easter', 'hanukkah', 'clear']
		let themes = {
			summer: ['🌴', '🏝️', '🕶️', '⛱️', '🦩'],
			fall: ['🍂', '🌰', '☕', '🥧', '🎑'],
			winter: ['🏔️', '🌲', '❄️', '⛄', '🧣'],
			spring: ['🌻', '🌼', '🌷', '🌾', '🌈', '🍃'],
			christmas: ['🎅', '🤶', '🧝', '🌟', '🎄', '🕯️', '🦌'],
			halloween: ['🕸️', '🕷️', '🦇', '🎃', '⚰️', '🐈‍⬛', '🧛', '👻', '☠️'],
			easter: ['🐇', '🍫', '🐤', '🥚', '🥕', '🔔'],
			hanukkah: ['🕎', '✡️', '🕍', '🕯️']
			/* other seasons here */
		};
        if(!options.includes(args[0])) return(message.reply(`Usage: ${prefix}${this.name} ${this.usage}`))
		let channelList = await message.guild.channels.fetch()
		channelList.forEach(element => {
			if(element.type === 'GUILD_CATEGORY') return
			if(element.type === 'GUILD_PUBLIC_THREAD') return
			if(element.type === 'GUILD_PRIVATE_THREAD') return
			if(element.type === 'GUILD_STAGE_VOICE') return
			if(element.type === 'UNKNOWN') return
			if(!element.permissionsFor(message.client.user.id).has('MANAGE_CHANNELS')) return
			if(args[0] === 'clear') {
				let seperate = element.name.split('')
				seperate.shift()
				seperate.pop()
				let joined = seperate.join('')
				element.setName(joined)
				return
			}
			let theme = themes[args[0]]
			let randomemoji = theme[Math.floor(Math.random() * theme.length)]
			let newname = randomemoji + element.name + randomemoji
			element.setName(newname)
		});
		message.reply('Decorating!')
	},
};
