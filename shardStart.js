const { ShardingManager } = require('discord.js');
const { token } = require('./config.json');

const manager = new ShardingManager('./index.js', { token: token });
let shardCount = 0;

manager.on('shardCreate', shard => {
	shardCount++;
	console.log(`Launched shard ${shardCount}. ID:${shard.id}`);
});

manager.spawn();

// please note that you wont need to run this file for a while, at least wait until the bot is in 2,000 servers.