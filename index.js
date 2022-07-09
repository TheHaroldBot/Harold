// https://github.com/TheHaroldBot/Harold

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
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const { token, topggToken, webPort, beta, topggAuth } = require('./config.json');
const { refreshShortUrls } = require('./functions.js');
const { AutoPoster } = require('topgg-autoposter');
if (!beta) {
	AutoPoster(topggToken, client);
	console.log('Started top.gg autoposter.');
}
const https = require('https');
const express = require('express');
const routes = require('./routes.js');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = webPort;
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const options = {
	key: fs.readFileSync('./web/ssl/privatekey.pem'),
	cert: fs.readFileSync('./web/ssl/certificate.pem'),
};
https.createServer(options, app).listen(PORT, function() {
	console.log('Express server listening on port ' + PORT);
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

const button = require('./events/button.js');
const selectMenu = require('./events/selectMenu.js');
const slashCommand = require('./events/slashCommand.js');
const autoComplete = require('./events/autocomplete.js');
const vote = require('./events/vote.js');
const bodyParser = require('body-parser');

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
	try {
		console.log(`Received ${interaction.type} interaction ${interaction.id ?? 'unknown id'}`);
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
	}
	catch (error) {
		console.log(`Error running interaction ${interaction.id ?? 'unknown id'}`);
	}
});

// client.on('debug', console.debug);
client.on('warn', console.warn);
client.on('error', console.error);
client.on('rateLimit', console.warn);

rl.on('line', async (input) => {
	try {
		await eval(input);
	}
	catch (error) {
		console.error(error);
	}
});

refreshShortUrls();

app.use(bodyParser.json(), routes, limiter);

app.post('/tggwg', (req, res) => {
	if (req.header('authorization') === topggAuth) {
		vote.execute(client, req.body);
		res.status(200).end();
	}
	else {
		console.log('Unauthorized vote request attempt.');
		res.send('Unauthorized');
		res.status(401).end();
	}
});

client.login(token).then(console.info('Logged in.'));