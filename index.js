// https://github.com/johng3587/Harold

/*
    Harold is a discord bot I made primarily for fun.
    Copyright (C) 2022  John Gooden

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

	Questions, comments, or concerns? Contact me at: johnnyg3587@gmail.com
*/

const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL'] });
const fs = require('fs');
const { token } = require('./config.json');

client.commands = new Collection();
client.cooldowns = new Collection();
client.aliases = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

const button = require('./events/button.js');
const selectMenu = require('./events/selectMenu.js');
const slashCommand = require('./events/slashCommand.js');
const autoComplete = require('./events/autocomplete.js');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
const selectMenuFiles = fs.readdirSync('./selectMenus').filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
	const buttonfile = require(`./buttons/${file}`);
	client.buttons.set(buttonfile.customId, buttonfile);
}

for (const file of selectMenuFiles) {
	const selectMenuFile = require(`./selectMenus/${file}`);
	client.selectMenus.set(selectMenuFile.customId, selectMenuFile);
}

for (const file of commandFiles) {
	const commandfile = require(`./commands/${file}`);
	client.commands.set(commandfile.name, commandfile);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once === true) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('interactionCreate', async interaction => {
	console.log(`Received interaction ${interaction.id ?? 'unknown id'}`);
	if (interaction.isButton()) {
		await button.execute(interaction);
	}
	else if (interaction.isSelectMenu()) {
		await selectMenu.execute(interaction);
	}
	else if (interaction.isCommand()) {
		await slashCommand.execute(interaction);
	}
	else if (interaction.isMessageContextMenu()) {
		return;
	}
	else if (interaction.isUserContextMenu()) {
		return;
	}
	else if (interaction.isAutocomplete()) {
		await autoComplete.execute(interaction);
	}
	else {
		return;
	}
});

client.on('debug', console.debug);
client.on('warn', console.warn);
client.on('error', console.error);
client.on('rateLimit', console.warn);

client.login(token).then(console.info('Logged in.'));