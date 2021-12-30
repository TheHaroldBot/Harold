const got = require('got');

module.exports = {
	name: 'setgame', // command name
	description: 'Sets the bot\'s game.', // command description
	usage: '<game name> **or** use nothing to get the latest github update', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: [],
	execute(message, args, prefix) { // inside here command stuff
		if (!args.length) {
			got('https://api.github.com/repos/johng3587/Harold/commits')
				.then(response => {
					const commits = JSON.parse(response.body);
					const latest = commits[0];
					message.client.user.setActivity(`Latest update: ${latest.commit.message}`);
				});
		}
		else {
			message.client.user.setActivity(message.content.replace(`${prefix}setgame `, ''));
			message.channel.send(`Game set to ${message.content.replace(`${prefix}setgame `, '')}`);
		}

	},
};