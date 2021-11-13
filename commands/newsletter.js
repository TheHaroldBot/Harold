const Discord = require('discord.js');
const ownerids = require('../config.json')

module.exports = {
	name: 'newsletter', //command name
	description: 'Send a newsletter to all the server owners the bot is in.', //command description
	args: true, //needs arguments? delete line if no
    usage: `<message>`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	permissions: [], //permissions required for command
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: ['news'],
	async execute(message, args, prefix) { //inside here command stuff
        let ownersendcount = 0
        let guildsendcount = 0
		const guilds = message.client.guilds.cache.map(guild => guild);
        const description = args.join(' ');
        const newsembed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`You've got mail!`)
            .setDescription(description)
            .setAuthor(`From: ${message.author.username}`, message.author.displayAvatarURL(), 'https://discord.gg/xnY4SZV2Cd')
            .setTimestamp();
        
        for (let index = 0; index < ownerids.length; index++) {
            const dmme = message.client.users.cache.get(config.ownerids[index])
            dmme.send({embeds: [newsembed]})
            .catch(console.error());
            ownersendcount++
        }
            guilds.forEach(async guild => {
                const owner = await guild.fetchOwner();
                try {
                    newsembed.setFooter(`Sent because you are the owner of ${guild.name}`)
                    await owner.send({embeds: [newsembed]})
                } catch (error) {
                    console.log(error)
                }
                guildsendcount++
            });
        
        message.reply(`Sent to ${guildsendcount} guild and ${ownersendcount} bot owners.`, {embeds: [newsembed]});
        message.react('📬');
	},
};