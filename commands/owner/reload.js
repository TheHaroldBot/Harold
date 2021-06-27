const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'reload', //command name
	description: 'Reloads a command', //command description
	args: true, //needs arguments? delete line if no
    usage: `<command>`, //usage instructions w/o command name and prefix
	cooldown: 1, //cooldown in seconds, defaults to 3
	ownerOnly: true, //need to be the owner? delete line if no
	execute(message, args, prefix, client) { //inside here command stuff
        const commandName = args[0].toLowerCase();
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
        if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}
        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));
        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
        	const newCommand = require(`../${folderName}/${command.name}.js`);
        	message.client.commands.set(newCommand.name, newCommand);
        	message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
        } catch (error) {
        	console.error(error);
        	message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
	},
};