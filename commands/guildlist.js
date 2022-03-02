module.exports = {
	name: 'guildlist', // command name
	description: 'Lists all guilds the bot is in.', // command description
	usage: '', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['serverlist', 'guildcount'],
	execute(message) { // inside here command stuff
		const Guilds = message.client.guilds.cache.map(guild => guild.name);
		message.reply(`We are in \`${Guilds.length}\` servers!`);
	},
};