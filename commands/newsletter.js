const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	name: 'newsletter', // command name
	description: 'Send a newsletter to all the server owners the bot is in. DO NOT USE THIS LIGHTLY!', // command description
	args: true, // needs arguments? delete line if no
	usage: '<message>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['news'],
	data: new SlashCommandBuilder()
		.setName('newsletter')
		.setDescription('Send a newsletter to all the server owners the bot is in. DO NOT USE THIS LIGHTLY!')
		.addStringOption(option =>
			option.setName('message')
				.setRequired(true)
				.setDescription('The message to send to the owners.')),

	async execute(interaction) { // inside here command stuff
		console.log('Initiating newsletter protocol');
		const guilds = interaction.client.guilds.cache;
		let timesSent = 0;
		const newsletterEmbed = new Discord.MessageEmbed()
			.setTitle('New Newsletter!')
			.setAuthor(interaction.user.tag, interaction.user.avatarURL())
			.setColor('RANDOM')
			.setDescription(interaction.options.getString('message'))
			.setTimestamp();
		guilds.forEach(async guild => {
			const guildOwnerID = guild.ownerId;
			const guildOwner = await interaction.client.users.fetch(guildOwnerID);
			if (guildOwner.bot) return;
			try {
				await guildOwner.send({ embeds: [newsletterEmbed] });
			}
			catch (error) {
				console.log('Failed to send newsletter to ' + guildOwner.tag);
				console.error(error);
			}
			timesSent++;
			console.log('Sent newsletter to ' + guildOwner.tag);
		});
		interaction.reply(`Successfully sent newsletter to ${timesSent} owners.`);
		interaction.client.channels.cache.get('875779429618565120').send({ embeds: [newsletterEmbed] });
	},
};