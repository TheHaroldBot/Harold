const fetch = require('node-fetch');

module.exports = {
	name: 'yomama', // command name
	description: 'Insults your mom.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 0.5, // cooldown in seconds, defaults to 3
	aliases: ['urmom'],
	execute(message) { // inside here command stuff
		const yomamasettings = { method: 'Get' };
		const yomamaurl = 'https://api.yomomma.info/'; // yo mama api
		fetch(yomamaurl, yomamasettings)
			.then(res => res.json())
			.then((json) => {
				message.reply(json.joke);
			})
			.catch(err => {
				console.log(err);
				message.reply('There was an error completing your request, try again later!');
			});
	},
};