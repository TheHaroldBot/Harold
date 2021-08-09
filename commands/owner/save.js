const Discord = require('discord.js');
const fs = require("fs")
const fetch = require('node-fetch');

module.exports = {
    name: 'save', //command name
    description: 'Saves an attatchment to the bot hard drive.', //command description
    usage: `(add attatchment)`, //usage instructions w/o command name and prefix
    cooldown: 5, //cooldown in seconds, defaults to 3
    permissions: [], //permissions required for command
    ownerOnly: true, //need to be the owner? delete line if no
    aliases: [],
    execute(message, args, prefix) { //inside here command stuff
        if (!message.attachments) return (message.reply('You have to attatch a file to save!'))
        fetch(message.attachments.first().url)
            .then(res => {
                const dest = fs.createWriteStream(`./saved/${message.attachments.first().name}`);
                res.body.pipe(dest);
            });
        message.reply('Saved!')
    }};