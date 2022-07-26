const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Message, Partials.Channel] });

module.exports = { client };