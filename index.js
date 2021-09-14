/*
A mascot and quality of life discord bot, mainly for the purpose of entertaining me.
    Copyright (C) 2021  John Gooden

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
*/

const { Client, Intents, Collection } = require('discord.js');
const Discord = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL'] });
const path = require("path")
const fs = require("fs")
const util = require('minecraft-server-util');
const removeFromArray = require('remove-from-array')
const got = require('got');
const ytdl = require("ytdl-core")
const { TIMEOUT } = require('dns');
const fetch = require('node-fetch');
const { token, ownerids, botid, prefix } = require('./config.json');
const readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var today = new Date();

client.commands = new Collection();
client.cooldowns = new Collection();
client.aliases = new Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const commandfile = require(`./commands/${folder}/${file}`);
        client.commands.set(commandfile.name, commandfile);
    }
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (message, ...args) => event.execute(message, ...args));
	} else {
		client.on(event.name, (message, ...args) => event.execute(message, ...args));
	}
}

client.on('messageCreate', message => {
    const { cooldowns } = client;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    //console.table([{Type: message.channel.type, Username: message.author.tag, Message: message.content}])
    if (message.guild === null) { //log dms
        console.log(`DM From: '${message.author.tag}' > '${message.content}'`)
    } else {
        console.log(`From: '${message.author.tag}' in '${message.guild.name}' > '${message.content}'`) //log guild messages
    }
    if (!message.content.startsWith(prefix)) return //starting now, ignore messages without prefix
    let botblocked = JSON.parse(fs.readFileSync('config.json'))
    if (botblocked.blocked.includes(ownerids) && message.author.id === ownerids) {
        message.author.send('You have been blocked by the bot! As the bot owner, this is an issue, go to the config.json file to remove yourself.')
        return
    }
    if (botblocked.blocked.includes(message.author.id)) return
    if (message.author.bot) return //ignore bots

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if (!command) return


    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }
    if (command.disabled) return
    if (command.guildOnly === true && message.guild === null) return (message.channel.send('Sorry! This command can only be run in a server, not a dm.'))
    if (command.ownerOnly === true && !ownerids.includes(message.author.id)) return (message.channel.send('Sorry! This command is reserved for the bot owner(s)'))
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
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    if (command.permissions && message.guild !== null) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply(`You are missing ${command.permissions} to do this!`);
        }
    }
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.reply(reply);
    }

    try {
        command.execute(message, args, prefix, client, ownerids);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.on('messageCreate', message => {
    let blocked = JSON.parse(fs.readFileSync('config.json'))
    if (blocked.blocked.includes(message.author.id)) return
    let ignoreautoresponse = JSON.parse(fs.readFileSync('config.json'))
    if (ignoreautoresponse.autoresponseignore.includes(message.author.id)) return
    if (message.webhookID) return;
   /*  if (message.author.presence.status === 'offline') { //checks if author is offline
        if (message.author.bot) return //if author is bot, forget them
        var calloutoffline = Math.random() < 0.1; //rolls a 10 sided die
        if (calloutoffline === true) { //if said die lands on 10, continue
            let ignorecallout = JSON.parse(fs.readFileSync('config.json'))
            if (ignorecallout.ignoreofflinecallout.includes(message.author.id)) return
            message.channel.send(`HEY EVERYONE! <@${message.author.id}> IS TRYING TO BE SNEAKY AND CHAT WHILE THEY ARE OFFLINE!`) //call out the coward
        }
    } */
    if (message.author.id === botid) return
    if (message.guild === null) return
    if (message.content.includes('poll2op')) { //poll with 2 options
        message.react('1️⃣')
        message.react('2️⃣')
    } else if (message.content.includes('poll3op')) { //poll with 3 options
        message.react('1️⃣')
        message.react('2️⃣')
        message.react('3️⃣')
    } else if (message.content.includes('poll4op')) { //poll with 4 options
        message.react('1️⃣')
        message.react('2️⃣')
        message.react('3️⃣')
        message.react('4️⃣')
    } else if (message.content === 'f') { //f
        message.channel.send('f')
    } else if (message.content.includes('hehe')) { //hehehe
        message.channel.send('hehehe')
    } else if (message.content.includes('smae')) { //its spelled 'same'
        message.channel.send('*same')
    } else if (message.content.includes('pollyn')) { //poll yes or no
        message.react('🇾')
        message.react('🇳')
    } else if (message.content.includes('stfu') || message.content.includes('Stfu')) { //i will not shut up
        message.channel.send('no u')
    } else if (message.content.includes('pollupdown')) { //poll upvote/downvote
        message.react('👍')
        message.react('👎')
    } else if (message.content.includes('doge') || message.content.includes('dogecoin')) { //dogecoin woo
        got('https://sochain.com/api/v2/get_price/DOGE/USD')
            .then(response => {
                let data = JSON.parse(response.body)
                message.channel.send(`Dogecoin is selling at Gemini for ${data.data.prices[0].price} USD\n\nDogecoin is selling at Binance for ${data.data.prices[1].price} USD`)
            })
    } else if (message.content.includes('heyya')) {
        message.channel.send('<a:heyyagoose:858742342974177290>')
    }

});

client.login(token).then(console.info(`Logged in.`))
