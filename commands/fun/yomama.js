const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'yomama', //command name
	description: 'Insults your mom.', //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: .5, //cooldown in seconds, defaults to 3
	aliases: ['urmom'],
	execute(message, args, prefix) { //inside here command stuff
		let yomamasettings = { method: "Get"}
        	let yomamaurl = 'https://api.yomomma.info/' //yo mama api
        	fetch(yomamaurl, yomamasettings)
        		.then(res => res.json())
        		.then((json) => {
        			message.channel.send(json.joke)
        		})
        		.catch(err => {
        			console.log(err)
        			message.channel.send('There was an error completing your request, try again later!')
        		})
	},
};