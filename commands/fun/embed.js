const Discord = require('discord.js');

module.exports = {
	name: 'embed', //command name
	description: 'Send an embed', //command description
    usage: `<JSON>`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
    args: true,
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
        try {
            let json = message.content.split(" ")
            json.shift()
            let data = json.join(" ")
            let embedjson = new Discord.MessageEmbed(JSON.parse(data))
            message.channel.send({ embeds: [embedjson]})
        } catch (error) {
            let errorembed = new Discord.MessageEmbed()
            console.log(error)
            .setTitle('Error!')
            .setDescription(`Something went wrong! There are a few possible issues:\n1. You tried to put text in a link option (Like putting 'hello' in the image option, or 'never gonna give you up' in the thumbnail option.)\n2. Something else\nI'll attatch the error below:`)
            .addField('Error Message', error)
            message.channel.send({ embeds: [errorembed]})
        }

        
	},
};