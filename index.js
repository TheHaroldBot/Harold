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
const Discord = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL'] });
const fs = require('fs');
const { token, ownerids } = require('./config.json');
let { errorWebhook } = require('./config.json');
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

client.on('interactionCreate', async interaction => {
	console.log(`Received interaction ${interaction.commandName ?? 'unknown name'} (${interaction.id ?? 'unknown id'})`);
	if (!interaction.isCommand()) return;
	const { cooldowns } = client;

	const config = JSON.parse(fs.readFileSync('config.json'));
	if (config.blocked.includes(interaction.user.id) && ownerids.includes(interaction.user.id)) {
		interaction.reply({ content: 'You have been blocked by the bot! As the bot owner, this is an issue, go to the config.json file to remove yourself.', ephemeral: true });
		return;
	}
	if (config.blocked.includes(interaction.user.id)) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return ('Command not found');

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	const commandDisabledEmbed = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/503').setFooter('Command currently disabled.').setColor('RED');
	if (command.disabled === true) return (interaction.reply({ embeds: [commandDisabledEmbed], ephemeral: true }), console.log('Command disabled.'));
	const guildOnlyEmbed = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/405').setFooter('Can\'t run in a DM, only a server.').setColor('RED');
	if (command.guildOnly === true && interaction.guild === null) return (interaction.reply({ embeds: [guildOnlyEmbed], ephemeral: true }), console.log('Command run in inappropriate environment.'));
	const notOwnerEmbed = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/401').setFooter('You are not the owner of this bot.').setColor('RED');
	if (command.ownerOnly === true && !ownerids.includes(interaction.user.id)) return (interaction.reply({ embeds: [notOwnerEmbed], ephemeral: true }), console.log('Command executed by non-owner.'));

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			const slowDownEmbed = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/420').setFooter(`Woah dude, calm down, you can use this again in ${timeLeft.toFixed(1)} seconds.`);
			return interaction.reply({ embeds: [slowDownEmbed], ephemeral: true });
		}
	}
	if (!ownerids.includes(interaction.user.id)) {
		timestamps.set(interaction.user.id, now);
	}
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	if (command.permissions && interaction.guild !== null) {
		const authorPerms = interaction.channel.permissionsFor(interaction.member);
		if (!authorPerms || !authorPerms.has(command.permissions)) return interaction.reply({ content: `You are missing ${command.permissions} to do this!`, ephemeral: true });
	}

	if (interaction.guild !== null) {
		if (!interaction.channel.permissionsFor(interaction.guild.me).has(command.myPermissions)) return interaction.reply({ content: `I am missing permissions to do this! Check to make sure I have the following permissions: \`${command.myPermissions}\``, ephemeral: true });
	}

	try {
		console.log(`Executing slash command '${command.name}' on behalf of ${interaction.user.id}`);
		await command.execute(interaction);
	}
	catch (error) {
		errorWebhook = new Discord.WebhookClient(errorWebhook);
		const errorEmbed = new Discord.MessageEmbed()
			.setTitle('Error')
			.setColor('#ff0000')
			.setDescription(`An error occured while executing the command ${command.name}:\n${error?.myMessage ?? 'Error message undefined'}`)
			.setImage('https://http.cat/' + (error?.code ?? 500));
		console.error(`Error executing ${command.name}:\n${error}`);
		if (ownerids.includes(interaction.user.id)) errorEmbed.setDescription(`An error occured while executing the command ${command.name}\n\n\`\`\`error\n${error?.stack ?? error.message}\n\`\`\``);
		await interaction.reply({ ephemeral: true, embeds: [errorEmbed] });
		if (error.report !== false) {
			errorEmbed.setDescription(`An error occured while executing the command ${command.name}\n\n\`\`\`error\n${error?.stack ?? error.message}\n\`\`\``);
			await errorWebhook.send({ embeds: [errorEmbed] });
			// await interaction.client.channels.cache.get('956057194971942992').send({ embeds: [errorEmbed] });
		}
	}
});

client.on('debug', console.debug);
client.on('warn', console.warn);
client.on('error', console.error);

client.login(token).then(console.info(`Node version: ${process.versions.node}\nLogged in.`));