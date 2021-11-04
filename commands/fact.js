const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'fact', //command name
	description: 'Gets a random fact.', //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: .5, //cooldown in seconds, defaults to 3
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
		let factsettings = { method: "Get" };
        	let facturl = 'https://uselessfacts.jsph.pl/random.json?language=en' //fact api, random fact
        	fetch(facturl, factsettings)
      		.then(res => res.json())
        		.then((json) => {
		        	const factembed = new Discord.MessageEmbed()
	        		.setTitle('Random Fact')
	        		.setDescription(json.text.replaceAll('`', "'"))
	        		.setFooter('From djtech.net')
		        	.setColor('RANDOM')
	        		message.channel.send({ embeds: [factembed]})
	        	})
	        	.catch(err => {
	        		console.log(err)
	        		message.channel.send('There was an error completing your request, try again later!')
		})
	},
};
