const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'joke', //command name
	description: 'Tells you a joke.', //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: .5, //cooldown in seconds, defaults to 3
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
		let jokesettings = { method: "Get"}
        	let jokeurl = 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,explicit,racist&type=twopart' //random joke api
	        fetch(jokeurl, jokesettings)
	        	.then(res => res.json())
	        	.then((json) => {
					let jokeembed = new Discord.MessageEmbed()
					.setTitle(json.setup)
					.setDescription(json.delivery)
					.setColor('RANDOM')
					.setFooter('jokeapi.dev')
					message.channel.send({ embeds: [jokeembed]})
	        	})
	        	.catch(err => {
	        		console.log(err)
	        		message.reply('There was an error completing your request, try again later!')
	        	})
	},
};