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
const { token, ownerids } = require('./config.json');
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
	if (!message.content.startsWith('*')) return;
	message.reply('Hello! I have moved to slash commands, which can be accessed by (you guessed it) pressing /. If my commands are not in your server, you might need to reinvite me for them to appear. (https://discordbotlist.com/bots/harold)');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const { cooldowns } = client;

	const botblocked = JSON.parse(fs.readFileSync('config.json'));
	if (botblocked.blocked.includes(interaction.user.id) && ownerids.includes(interaction.user.id)) {
		interaction.reply({ content: 'You have been blocked by the bot! As the bot owner, this is an issue, go to the config.json file to remove yourself.', ephemeral: true });
		return;
	}
	if (botblocked.blocked.includes(interaction.user.id)) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	console.log(`Executing slash command '${command.name}' on behalf of ${interaction.user.tag} (${interaction.user.id})`);

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	if (command.disabled === true) return (interaction.reply({ content: 'This command is currently disabled, try again another time!', ephemeral: true }));
	if (command.guildOnly === true && interaction.guild === null) return (interaction.reply({ content: 'Sorry! This command can only be run in a server, not a dm.', ephemeral: true }));
	if (command.ownerOnly === true && !ownerids.includes(interaction.user.id)) return (interaction.reply({ content: 'Sorry! This command is reserved for the bot owner(s)', ephemeral: true }));

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return interaction.reply({ content: `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`, ephemeral: true });
		}
	}
	if (!ownerids.includes(interaction.user.id)) {
		timestamps.set(interaction.user.id, now);
	}
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	if (command.permissions && interaction.guild !== null) {
		const authorPerms = interaction.channel.permissionsFor(interaction.member);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return interaction.reply({ content: `You are missing ${command.permissions} to do this!`, ephemeral: true });
		}
	}

	if (interaction.guild !== null) {
		if (!interaction.channel.permissionsFor(interaction.guild.me).has(command.myPermissions)) return interaction.reply({ content: `I am missing permissions to do this! Check to make sure I have the following permissions: \`${command.myPermissions}\``, ephemeral: true });
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(`Error executing ${command.name}:\n${error}`);
		await interaction.reply('There was an error trying to execute that command!', true);
	}
});

client.on('debug', console.debug);
client.on('warn', console.warn);
client.on('error', console.error);

client.login(token).then(console.info(`Node version: ${process.versions.node}\nLogged in.`));