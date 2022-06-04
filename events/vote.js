const { logUsage } = require('../functions.js');

module.exports = {
	name: 'vote', // name, duh
	async execute(client, data) { // stuff to do
		try {
			const targetUser = await client.users.cache.get(data.user);
			await targetUser.send('Thank you for voting!');
			logUsage({ name: 'vote' });
		}
		catch (error) {
			console.error('Whoops! Something went wrong while thanking a vote.');
			console.error(error);
		}

	},
};