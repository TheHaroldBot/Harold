const { logUsage } = require('../functions.js');

module.exports = {
	name: 'vote', // name, duh
	async execute(client, id) { // stuff to do
		try {
			const targetUser = await client.users.cache.get(id);
			await targetUser.send('Thank you for voting!');
			logUsage({ name: 'vote' });
		}
		catch (error) {
			console.error('Whoops! Something went wrong while thanking a vote.');
			console.error(error);
		}

	},
};