const Discord = require('discord.js');
const Chatbot  =  require("discord-chatbot");

const chatbot  =  new  Chatbot({name: "harold", gender: "Male"});

module.exports = {
	name: 'chatbot', //command name
	description: 'Starts the chat bot.', //command description
    usage: `<seconds to keep the chat bot open, maximum of 1800>`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
        let time = 60
        if(args.length) {
            time = args[0]
        }
        if(time >= 1800) return(message.reply('That number is too big, it has to be less than or equal to 1800 seconds.'))
        let timeinmiliseconds = time * 1000
        const collector = message.channel.createMessageCollector({time: timeinmiliseconds });
        message.reply(`I will listen for your conversation for ${time} seconds.`)
        collector.on('collect', m => {
            if(m.author.bot) return
            let tobot = m.content.toLowerCase()
            chatbot.chat(tobot).then(response => m.channel.send(response)).catch(e => console.log(e));
            
        });
        collector.on('end', collected => {
            message.channel.send('I\'m tired, I think i\'ll sleep now.')
        });
	},
};