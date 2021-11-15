const { DiscordAPIError } = require("discord.js");
const Discord = require('discord.js');

module.exports = {
	name: 'help', //command name
	description: 'Lists commands or gets info about a specific command.',
    usage: `(command name)`,
    guildOnly: false,
	cooldown: 5,
	execute(message, args, prefix, ownerid) { //inside here command stuff
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
	        data.push(commands.filter(command => !command.ownerOnly).map(command => command.name).join('\n'));
        	data.push(`\n**\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
			let description = '**' + data
            const helpembed = new Discord.MessageEmbed()
            .setTitle("Here's a list of all my commands:")
	    	.setURL('https://discord.gg/xnY4SZV2Cd/')
            .setDescription(description, { split: true})
            .setColor('RANDOM')
			.addField('Join our support server!', '[Join here!](https://discord.gg/xnY4SZV2Cd)')
			.setAuthor('Harold!!', message.client.user.avatarURL(), 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')

        	return message.author.send({ embeds: [helpembed]})
	    	.then(() => {
			if (message.channel.type === 'dm') return;
			message.react('📬');
	    	})
	    	.catch(error => {
			console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
			message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
		});
		}
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
        	return message.reply('that\'s not a valid command!');
        }
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
        const helpembed = new Discord.MessageEmbed()
        .setTitle(`Name: ${command.name}`)
        .setDescription(data.join('\n'), { split: true})
		.addField('Join our support server!', '[Join here!](https://discord.gg/xnY4SZV2Cd)')
        .setColor('RANDOM')
        message.channel.send({ embeds: [helpembed]})
	},
};
