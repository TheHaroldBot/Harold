// https://github.com/johng3587/Harold

/*
    A mascot and quality of life discord bot, mainly for the purpose of entertaining people.
    Copyright (C) 2021  John Gooden

    This program is free software: you can redistribute it and/or modify
    it under the terms listed in the LICENSE file.
*/

const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL'] });
const fs = require('fs');
const { token, ownerids, prefix } = require('./config.json');
client.commands = new Collection();
client.cooldowns = new Collection();
client.aliases = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const commandfile = require(`./commands/${file}`);
	client.commands.set(commandfile.name, commandfile);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));


for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once === true) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('messageCreate', message => {
	const { cooldowns } = client;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	if (message.guild === null) {
		// log dms
		console.log(`DM From: '${message.author.tag} (${message.author.id})' > '${message.content}'`);
		const dmchannel = client.channels.cache.get('905618810831253514');
		dmchannel.send(`DM From: '${message.author.tag} (${message.author.id})' > '${message.content}'`);
	}
	if (!message.content.startsWith(prefix)) return;
	// starting now, ignore messages without prefix
	const botblocked = JSON.parse(fs.readFileSync('config.json'));
	if (botblocked.blocked.includes(message.author.id) && ownerids.includes(message.author.id)) {
		message.author.send('You have been blocked by the bot! As the bot owner, this is an issue, go to the config.json file to remove yourself.');
		return;
	}
	if (botblocked.blocked.includes(message.author.id)) return;
	if (message.author.bot) return; // ignore bots

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}
	if (command.disabled === true) return (message.reply('This command is currently disabled, try again another time!'));
	if (command.guildOnly === true && message.guild === null) return (message.reply('Sorry! This command can only be run in a server, not a dm.'));
	if (command.ownerOnly === true && !ownerids.includes(message.author.id)) return (message.reply('Sorry! This command is reserved for the bot owner(s)'));
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	if (!ownerids.includes(message.author.id)) {
		timestamps.set(message.author.id, now);
	}
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	if (command.permissions && message.guild !== null) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply(`You are missing ${command.permissions} to do this!`);
		}
	}
	if (command.args === true && !args.length) {
		let reply = 'You didn\'t provide any arguments!';

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.reply(reply);
	}

	try {
		console.info(`Executing command '${command.name}' on behalf of ${message.author.tag} (${message.author.id})`);
		command.execute(message, args, prefix, client, ownerids);
	}
	catch (error) {
		console.error(`Error executing ${command.name}:\n${error}`);
		message.reply('There was an error trying to execute that command!');
	}
});

client.login(token).then(console.info(`Node version: ${process.versions.node}\nLogged in.`));