module.exports = {
	name: 'reload', // command name
	description: 'Reloads a command', // command description
	usage: '<command>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	args: true,
	permissions: [], // permissions required for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: [],
	execute(message, args) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

		delete require.cache[require.resolve(`../commands/${command.name}.js`)];

		try {
			const newCommand = require(`../commands/${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
		}
		catch (error) {
			console.error(error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};