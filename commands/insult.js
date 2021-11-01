const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'insult', //command name
	description: 'Insults you.', //command description
    usage: ``, //usage instructions w/o command name and prefix
	cooldown: .5, //cooldown in seconds, defaults to 3
	aliases: [],
	execute(message, args, prefix) { //inside here command stuff
		let insultsettings = { method: "Get"}
        	let insulturl = 'https://insult.mattbas.org/api/insult.json' //insult api
        	fetch(insulturl, insultsettings)
        		.then(res => res.json())
        		.then((json) => {
        			message.channel.send(json.insult)
        		})
        		.catch(err => {
        			console.log(err)
        			message.channel.send('There was an error completing your request, try again later!')
        		});
	},
};