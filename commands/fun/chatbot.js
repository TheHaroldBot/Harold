const Discord = require('discord.js');
const Chatbot  =  require("discord-chatbot");

const chatbot  =  new  Chatbot({name: "Harold", gender: "Male"});

module.exports = {
	name: 'chatbot', //command name
	description: 'Starts the chat bot.', //command description
    usage: `<seconds to keep the chat bot open, maximum of 1800>`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
        let time = 300
        if(args.length) {
            time = args[0]
        }
        let timeinseconds = time * 1000
        const collector = message.channel.createMessageCollector({time: timeinseconds });
        message.reply(`Hello! I will listen for your conversation for ${time} seconds.`)
        collector.on('collect', m => {
            chatbot.chat(m.content).then(m.channel.send).catch(e => console.log(e));
            
        });
        collector.on('end', collected => {
            message.channel.send('I\'m tired, I think i\'ll sleep now.')
        });
	},
};