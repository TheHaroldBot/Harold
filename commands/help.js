const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ownerids = require('../config.json').ownerids;

module.exports = {
	name: 'help', // command name
	description: 'Lists commands or gets info about a specific command.',
	usage: '(command name)',
	guildOnly: false,
	cooldown: 5,
	permissions: [],
	myPermissions: ['SEND_MESSAGES'],
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Lists commands or gets info about a specific command.')
		.addStringOption(option =>
			option.setName('command')
				.setRequired(false)
				.setAutocomplete(true)
				.setDescription('The name of the command to get info about.')),
	autoComplete: async (interaction) => {
		const currentValue = interaction.options.getFocused();
		const toRespond = [];
		let commands = [];
		if (ownerids.includes(interaction.user.id)) {
			commands = await interaction.client.commands.filter(c => c.name.startsWith(currentValue));
		}
		else {
			commands = await interaction.client.commands.filter(c => c.name.startsWith(currentValue) && !c.ownerOnly);
		}

		commands.forEach(command => {
			toRespond.push({
				name: command.name,
				value: command.name,
			});
		});
		return toRespond;
	},

	async execute(interaction) { // inside here command stuff
		const data = [];
		const { commands } = interaction.client;

		if (!interaction.options.getString('command')) {
			data.push(commands.filter(command => !command.ownerOnly).map(command => command.name).join('\n'));
			data.push('\n**\nYou can send `/help [command name]` to get info on a specific command!');
			const description = '**' + data;
			const helpembed = new Discord.MessageEmbed()
				.setTitle('Here\'s a list of all my commands:')
				.setURL('https://discord.gg/xnY4SZV2Cd')
				.setDescription(description, { split: true })
				.setColor('RANDOM')
				.addField('Join our support server!', '[Join here!](https://discord.gg/xnY4SZV2Cd)')
				.setAuthor({ name: 'Harold!!', iconURL: interaction.client.user.avatarURL(), url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });

			try {
				await interaction.reply({ embeds: [helpembed], ephemeral: true });
			}
			catch (error) {
				throw new error(error.stack);
			}
			return;
		}
		const name = interaction.options.getString('command').toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return interaction.reply({ content: 'That\'s not a valid command!', ephemeral: true });
		}
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** /${command.name} ${command.usage}`);
		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
		const helpembed = new Discord.MessageEmbed()
			.setTitle(`Name: ${command.name}`)
			.setDescription(data.join('\n'), { split: true })
			.addField('Join our support server!', '[Join here!](https://discord.gg/xnY4SZV2Cd)')
			.setColor('RANDOM');
		if (command.ownerOnly) {
			helpembed.setDescription(`${helpembed.description}\n\n**This is an owner only command!**\nBe careful using these, as they may affect the bot significantly.`);
		}

		try {
			await interaction.reply({ embeds: [helpembed], ephemeral: true });
		}
		catch (error) {
			const returnError = { message: error.message, stack: error.stack, code: 500, report: true, myMessage: 'Uh-oh, something went wrong!' };
			throw returnError;
		}
	},
};
