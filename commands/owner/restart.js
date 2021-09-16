const Discord = require('discord.js');

module.exports = {
	name: 'restart', //command name
	description: 'Restart the bot.', //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: ['shutdown'],
	execute(message, args, prefix) { //inside here command stuff
		let originalAuthor = message.author.id
		message.channel.send('Please confirm you want to shut down the bot.\nYou have 10 seconds to reply with \'y\' or \'yes\'')
		const collector = message.channel.createMessageCollector({time: 10000 });
		collector.on('collect', m => {
			if(m.author.bot) return
            if(m.author.id !== originalAuthor) return(m.reply('You didn\'t request the restart, you cannot confirm it.'))
			let content = m.content.toLowerCase()
			if(content === 'y' || m.content === 'yes') {
				process.exit()
			} else return
        });
		collector.on('end', collected => {
			message.reply('Shutdown expired!')
		});
	},
};