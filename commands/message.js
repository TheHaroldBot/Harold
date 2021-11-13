const Discord = require('discord.js');

module.exports = {
	name: 'message', //command name
	description: 'Message someone by ID', //command description
	args: true, //needs arguments? delete line if no
    usage: `<user id> <message>`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: ['msg'], //aliases for command
	async execute(message, args, prefix) { //inside here command stuff
		const dmme = message.client.users.cache.get(args[0]);
        const msgembed = new Discord.MessageEmbed()
        	.setTitle('New message!')
        	.setAuthor(message.author.username, message.author.avatarURL())
        	.setDescription(args.slice(1).join(' '))
        	.setTimestamp()
        	.setColor('RANDOM')
			try {
				await dmme.send({embeds: [msgembed]})
			} catch (error) {
				console.log(error)
			}
	},
};