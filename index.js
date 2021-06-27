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



const Discord = require('discord.js');
const client = new Discord.Client();
const Webhook = require('discord.js');
const { Attatchment } = require('discord.js')
const path = require("path")
const fs = require("fs")
const discordInv = require('discord-inv');
const util = require('minecraft-server-util');
const removeFromArray = require('remove-from-array')
const got = require('got');
const ytdl = require("ytdl-core")
const disbut = require('discord-buttons')
const { TIMEOUT } = require('dns');
const fetch = require('node-fetch');
const reportwebhook = new Discord.WebhookClient('809818709144633415', 'JW8sEYjgkYlG7pbg0Go4jb4-HYI6OgyRzh__OB4ZP2cNlsFnQ1dRn-uqCfaVmX0OsNG-')
const suggestionwebhook = new Discord.WebhookClient('824303438292582451', 'Ux76_IeqplB1IQdBSPrS7iQ5Wzalpfn1iP3-H78UKbNt-AQsAXVGmDf__1aTQA3jg2C7')
const { token, ownerid, botid, ignoreofflinecallout, ignore } = require('./config.json');
const { captureRejectionSymbol } = require('events');
const prefix = "*"
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
  })
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.aliases = new Discord.Collection()


const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const commandfile = require(`./commands/${folder}/${file}`);
		client.commands.set(commandfile.name, commandfile);
	}
}


let isHibernating = false; //Global (top level) variable
const Hibernate = (client) => {
    if(!client){ return(false) }
    client.user.setPresence({ //Sets detailed presence
        activity: {
            name: "Hibernation",
            type: "PLAYING"
        },
        status: 'idle',
        afk: true
    });
    isHibernating = true;
}

client.on('ready', () => {
    console.log('Kinetic SMP Bot  Copyright (C) 2021  John Gooden')
	console.log('Copyright info: https://github.com/johng3587/KineticSMPBot/blob/main/LICENCE\n\n')
})

client.on('message', message => {
    const { cooldowns } = client;
	if(message.content.includes(`${prefix}hibernate_off`)) { //hibernate off listener
        if(!isHibernating) return
        if(!ownerid.includes(message.author.id)) return
        isHibernating = false
        client.user.setPresence({ //Sets detailed presence
          activity: {
              name: "",
              type: "PLAYING"
          },
          status: 'online',
          afk: false
      });
      message.channel.send('Im back!')
    }
    if(isHibernating){ return(false) } //Bot is Hibernating
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
     if(message.webhookID) return;
     if(message.guild === null) { //log dms
      console.log(`DM From: ${message.author.tag} > ${message.content}`)
    } else {
      console.log(`From: ${message.author.tag} > ${message.content}`) //log guild messages
  }
    if(!message.content.startsWith(prefix)) return //starting now, ignore messages without prefix
    let botblocked = JSON.parse(fs.readFileSync('blocked.json'))
    if(botblocked.blocked.includes(ownerid) && message.author.id === ownerid) {
        message.author.send('You have been blocked by the bot! As the bot owner, this is an issue, go to the blocked.json file to remove yourself.')
        return
    }
    if(botblocked.blocked.includes(message.author.id)) return
    if(message.author.bot) return //ignore bots

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if(!command) return
        

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    if (command.disabled) {
        return
    }
    if (command.ownerOnly === true) {
        if(!ownerid.includes(message.author.id)) return(message.channel.send('Sorry! This command is reserved for the bot owner(s)'))
    }
    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply(`You are missing ${command.permissions} to do this!`);
        }
    }
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
    
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
    
        return message.channel.send(reply);
    }

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
    

	try {
		command.execute(message, args, prefix, client, ownerid);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('message', message => {
    if(isHibernating){ return(false) } //Bot is Hibernating
    let blocked = JSON.parse(fs.readFileSync('blocked.json'))
    if(blocked.blocked.includes(message.author.id)) return
    let ignoreautoresponse = JSON.parse(fs.readFileSync('config.json'))
    if(ignoreautoresponse.autoresponseignore.includes(message.author.id)) return
    if(message.webhookID) return;
    if(message.author.presence.status === 'offline') { //checks if author is offline
     if(message.author.bot) return //if author is bot, forget them
     var calloutoffline = Math.random() < 0.1; //rolls a 10 sided die
     if(calloutoffline === true) { //if said die lands on 10, continue
        let ignorecallout = JSON.parse(fs.readFileSync('config.json'))
        if(ignorecallout.ignoreofflinecallout.includes(message.author.id)) return
        message.channel.send(`HEY EVERYONE! <@${message.author.id}> IS TRYING TO BE SNEAKY AND CHAT WHILE THEY ARE OFFLINE!`) //call out the coward
        }
    }
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
    } else if (message.content.includes('oof')) { //oof
        message.channel.send('oof')
    } else if (message.content.includes('minecraft')) { //minecraft is good
        message.channel.send('gud')
    } else if (message.content.includes('hehe')) { //hehehe
        message.channel.send('hehehe')
    } else if (message.content.includes('smae')) { //its spelled 'same'
        message.channel.send('*same')
    } else if (message.content.includes('giu')) { //cutie giu
        message.channel.send('is cute')
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

    client.on('clickbutton', async (button) => {
        console.log(`${button.clicker.user.tag} clicked ${button.id}`)
        if (button.id === 'leavebutton') {
            button.channel.send('Goodbye!')
            console.log(`Now leaving ${button.guild.name}`)
            button.defer()
            const leavebutton = new disbut.MessageButton()
            .setStyle('red')
            .setLabel('Leave Server')
            .setID('leavebutton')
            .setDisabled(true)
            button.message.edit('Click to confirm:', leavebutton)
            button.guild.leave()
        } else if (button.id === 'shutdownbutton') {
            if (!ownerid.includes(button.clicker.user.id)) return(button.reply.send('Only the bot owner can press this button!', true))
            const shutdownbutton = new disbut.MessageButton()
            .setStyle('red')
            .setLabel('Shutdown')
            .setID('shutdownbutton')
            .setDisabled(true)
            button.message.edit('Click to confirm:', shutdownbutton)
            button.defer()
            button.channel.send('Goodbye!')
            client.destroy()
            process.exit()
        } else if (button.id === 'hibernatebutton') {
            if (!ownerid.includes(button.clicker.user.id)) return(button.reply.send('Only the bot owner can press this button!', true))
            const hibernatebutton = new disbut.MessageButton()
            .setStyle('red')
            .setLabel('Hibernate')
            .setID('hibernatebutton')
            .setDisabled(true)
            button.message.edit('Click to confirm:', hibernatebutton)
            button.reply.send('Goodnight!')
            Hibernate(client);
        }
    });
    
client.login(token);