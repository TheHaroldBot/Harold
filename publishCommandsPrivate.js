const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, botid } = require('./config.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
console.log(`Command files found: ${commandFiles}`);

// Place your client and guild ids here
const guildId = '788813687283646515';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if (command.ownerOnly && command.data) {
		commands.push(command.data.toJSON());
		console.log(`Added ${command.data.name}`);
	}
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(botid, guildId),
			{ body: commands },
		);

		console.log(commands);
		console.log(`Successfully reloaded ${commands.length} application (/) commands privately.`);
	}
	catch (error) {
		console.error(error);
	}
})();
