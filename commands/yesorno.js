module.exports = {
	name: 'yesorno', // command name
	description: 'Picks either yes or no.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 2, // cooldown in seconds, defaults to 3
	aliases: ['yn'],
	execute(message) { // inside here command stuff
		const yesorno = (Math.random() < 0.5); // random yes or no. another pointless one.
		if (yesorno === true) {
			message.channel.send ('Yes');
		}
		else {
			message.channel.send ('No');
		}
	},
};