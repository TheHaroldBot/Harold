const Discord = require('discord.js');
    
module.exports = {
    name: 'formatting', //command name
    description: 'A guide to Discord formatting', //command description
    args: false, //needs arguments?
    usage: ``, //usage instructions w/o command name and prefix
    guildOnly: false, //execute in a guild only?
    cooldown: 3, //cooldown in seconds, defaults to 3
    permissions: [], //permissions required for command
    ownerOnly: false, //need to be the owner? delete line if no
    disabled: false, //command disabled to all? delete line if no
    aliases: ['format'],
    execute(message, args, prefix) { //inside here command stuff
        message.author.send(`
\`\`\`txt
# A handy guide to Discord formatting.

# Text formatting:
**bold**
*italic*
__underline__
~~strikethrough~~
***bold and italic***
***__~~bold, italic, underlined, and strikethrough~~__***
||spoiler||

# Quote formatting:
> - quote a single line
>>> - quote until end of message

# Mention formatting:
<@userId> - mention a user
<@&roleId> - mention a role
<#channelId> - mention a channel

# Code formatting:
\`Single line code block, no color\`
\`\`‎\`codingLanguage
Multi-line code block, with language color
\`\`‎\`

# Time formatting:
<t:unixTimestamp:d> - send a timestamp in mm/dd/yyyy format
<t:unixTimestamp:D> - send a timestamp in Month Day, Year format
<t:unixTimestamp:t> - send a timestamp in hh:mm AM/PM format
<t:unixTimestamp:T> - send a timestamp in hh:mm:ss AM/PM format
<t:unixTimestamp:f> - send a timestamp in Month Day, Year hh:mm AM/PM format
<t:unixTimestamp> - send a timestamp in Month Day, Year hh:mm AM/PM format
<t:unixTimestamp:F> - send a timestamp in Weekday, Month Day, Year hh:mm AM/PM format
<t:unixTimestamp:R> - send a timestamp in relative format
unixTimestamp - send a timestamp in unix format
Converter at https://hammertime.djdavid98.art/
\`\`\`
        `)
        message.react('📬')
    },
};