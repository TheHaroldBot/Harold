<div align="center">

  <p>
    <a href="https://www.npmjs.com/package/djs-linereply"><img src="https://img.shields.io/npm/v/djs-linereply?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/djs-linereply"><img src="https://img.shields.io/npm/dt/djs-linereply?maxAge=3600" alt="NPM downloads" /></a>
  </p>

  <p>
    <a href="https://www.npmjs.com/package/djs-linereply"><img src="https://nodei.co/npm/djs-linereply.png?downloads=true&stars=true" alt="NPM Banner"></a>
  </p>
</div>

## Install
```sh
$ npm i djs-linereply
```
## Setup
```js
const discord = require('discord.js');
require('djs-linereply'); //⚠️ IMPORTANT: put this before your discord.Client()
const client = new discord.Client(
    {
        //OPTIONS
    }
);
```

<h1>Discord.js</h2>

## Example
```js
const discord = require('discord.js');
require('djs-linereply'); //⚠️ IMPORTANT: put this before your discord.Client()
const client = new discord.Client(
    {
        //OPTIONS
    }
);

client.on('ready', () => {
    console.log('Bot is online.');
});

client.on('message', async message => {
    if (message.content.startsWith('inline-mention')) {
        message.lineReply('Hey'); //Inline Reply with mention
    } else if (message.content.startsWith('inline-nomention')) {
        message.lineReplyNoMention('Hey'); //Inline Reply without mention
    };
});

client.login('TOKEN');
```
<img src="https://cdn.discordapp.com/attachments/868403236284014602/871743055085056020/Capture.PNG"
     alt="IMAGE"
     style="float: left; margin-right: 10px;" />

## Embed
```js
if (message.content.startsWith('inline')) {
    let embed = new discord.MessageEmbed()
        .setDescription(`Reply to ${message.author.username}`);

    message.lineReply(embed); //Line (Inline) Reply with mention

    //or

    message.lineReplyNoMention(embed); //Line (Inline) Reply without mention
};
```
<img src="https://cdn.discordapp.com/attachments/868403236284014602/871743054564974622/Capture2.PNG"
     alt="IMAGE"
     style="float: left; margin-right: 10px;" />

<h2 style="display:inline;">Edit</h2> <h4 style="display:inline;">(Async Function)</h4>

```js
if (message.content.startsWith('inline')) {

    let m = await message.lineReply('Hi');

    let ping = (m.createdTimestamp - message.createdTimestamp);

    m.edit('Hello');
};
```
<img src="https://cdn.discordapp.com/attachments/868403236284014602/871743053801611324/Capture3.PNG"
     alt="IMAGE"
     style="float: left; margin-right: 10px;" />

## Command Handler
```js
/**
 * No need to define it
 * */
module.exports = {
  name: 'inline',
  
  run: (client, message, args) => {
    message.lineReply('This is reply with @mention');
  }
}
```
<img src="https://cdn.discordapp.com/attachments/868403236284014602/871743058704748604/Capture4.PNG"
     alt="IMAGE"
     style="float: left; margin-right: 10px;" />

<hr>