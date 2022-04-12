const got = require('got');

module.exports = {
	name: 'ready', // name, duh
	once: true, // remove if false
	execute(client) { // stuff to do
		console.info(`Ready at: ${client.readyAt}`);
		console.info('Harold Bot Copyright (C) 2022  John Gooden');
		console.info('Copyright info: https://github.com/johng3587/Harold/blob/main/LICENSE\n\n');
		got('https://api.github.com/repos/johng3587/Harold/commits')
			.then(response => {
				const commits = JSON.parse(response.body);
				const latest = commits[0];
				client.user.setActivity(`Latest update: ${latest.commit.message}`);
			});
	},
};