const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, botid } = require('./config.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if (!command.ownerOnly && !command.disabled && command.data) {
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(botid),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${commands.length} application (/) commands publicly.`);
	}
	catch (error) {
		console.error(error);
	}
})();
