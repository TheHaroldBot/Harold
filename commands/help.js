const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

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
				.setDescription('The name of the command to get info about.')),

	async execute(interaction) { // inside here command stuff
		const data = [];
		const { commands } = interaction.client;

		if (!interaction.options.getString('command')) {
			data.push(commands.filter(command => !command.ownerOnly).map(command => command.name).join('\n'));
			data.push('\n**\nYou can send `/help [command name]` to get info on a specific command!');
			const description = '**' + data;
			const helpembed = new Discord.MessageEmbed()
				.setTitle('Here\'s a list of all my commands:')
				.setURL('https://discord.gg/xnY4SZV2Cd/')
				.setDescription(description, { split: true })
				.setColor('RANDOM')
				.addField('Join our support server!', '[Join here!](https://discord.gg/xnY4SZV2Cd)')
				.setAuthor('Harold!!', interaction.client.user.avatarURL(), 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

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
		try {
			await interaction.reply({ embeds: [helpembed], ephemeral: true });
		}
		catch (error) {
			throw new Error(error.stack);
		}
	},
};
