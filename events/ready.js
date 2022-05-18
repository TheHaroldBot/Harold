const fetch = require('node-fetch');

module.exports = {
	name: 'ready', // name, duh
	once: true, // remove if false
	async execute(client) { // stuff to do
		console.info(`Ready at: ${client.readyAt}`);
		console.info('Harold Bot Copyright (C) 2022  John Gooden');
		console.info('Copyright info: https://github.com/TheHaroldBot/Harold/blob/main/LICENSE\n\n');
		await fetch('https://api.github.com/repos/TheHaroldBot/Harold/commits', { method: 'Get' })
			.then(async response => {
				const commits = await response.json();
				const latest = commits[0];
				client.user.setActivity(`Latest update: ${latest.commit.message}`);
			});
	},
};