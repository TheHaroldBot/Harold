const Discord = require('discord.js');
const { translate } = require('bing-translate-api');

module.exports = {
	name: 'translate', //command name
	description: 'Translates the message you replied to.', //command description
    usage: `(Reply to a message)`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: [],
	async execute(message, args, prefix) { //inside here command stuff
		if(!message.reference) return(message.reply('You didn\'t reply to a message!'))
        let messageReplied = await message.channel.messages.fetch(message.reference.messageId)
        translate(messageReplied.content, null, 'en', false).then(res => {
            let translationembed = new Discord.MessageEmbed()
            .setTitle(`From: ${res.language.from}, to: ${res.language.to}`)
            .setDescription(`**Translated:** ${res.translation}`)
            .setColor('RANDOM')
            message.reply({embeds: [translationembed]})
            }).catch(err => {
            console.error(err);
            });
    },
};