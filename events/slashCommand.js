const { Collection } = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs');
const { ownerids, errorChannel } = require('../config.json');
const { logUsage } = require('../functions.js');

module.exports = {
	name: 'slashCommand',
	async execute(interaction) {
		const { cooldowns } = interaction.client;

		const config = JSON.parse(fs.readFileSync('config.json'));
		if (config.blocked.includes(interaction.user.id) && ownerids.includes(interaction.user.id)) {
			interaction.reply({ content: 'You have been blocked by the bot! As the bot owner, this is an issue, go to the config.json file to remove yourself.', ephemeral: true });
			return;
		}
		if (config.blocked.includes(interaction.user.id)) return;

		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) return (interaction.reply('Command not found'));

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const commandDisabledEmbed = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/503').setFooter({ text: 'Command currently disabled.' }).setColor('RED');
		if (command.disabled === true) return (interaction.reply({ embeds: [commandDisabledEmbed], ephemeral: true }), console.log('Command disabled.'));
		const guildOnlyEmbed = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/405').setFooter({ text: 'Can\'t run in a DM, only a server.' }).setColor('RED');
		if (command.guildOnly === true && interaction.guild === null) return (interaction.reply({ embeds: [guildOnlyEmbed], ephemeral: true }), console.log('Command run in inappropriate environment.'));
		const notOwnerEmbed = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/401').setFooter({ text: 'You are not the owner of this bot.' }).setColor('RED');
		if (command.ownerOnly === true && !ownerids.includes(interaction.user.id)) return (interaction.reply({ embeds: [notOwnerEmbed], ephemeral: true }), console.log('Command executed by non-owner.'));

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;
		const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setLabel('Resolve')
					.setStyle('DANGER')
					.setCustomId('resolve'), // remove if style is LINK
			);

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				const slowDownEmbed = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/420').setFooter({ text: `Woah dude, calm down, you can use this again in ${timeLeft.toFixed(1)} seconds.` });
				return interaction.reply({ embeds: [slowDownEmbed], ephemeral: true });
			}
		}
		if (!ownerids.includes(interaction.user.id)) {
			timestamps.set(interaction.user.id, now);
		}
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		if (command.permissions && interaction.guild !== null) {
			const authorPerms = interaction.channel.permissionsFor(interaction.member);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				const missingYourPerms = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/401').setFooter({ text: `You are missing permission to do this. You need ${command.permissions}.` }).setColor('RED');
				interaction.reply({ embeds: [missingYourPerms], ephemeral: true });
			}
		}

		if (interaction.guild !== null && command.myPermissions) {
			if (!interaction.channel.permissionsFor(interaction.guild.me).has(command.myPermissions)) {
				const missingMyPerms = new Discord.MessageEmbed().setTitle('Error!').setImage('https://http.cat/401').setFooter({ text: `I am missing permission to do this. I need ${command.myPermissions}.` }).setColor('RED');
				interaction.reply({ embeds: [missingMyPerms], ephemeral: true });
			}
		}

		try {
			console.log(`Executing slash command '${command.name}' on behalf of ${interaction.user.id}`);
			logUsage(command);
			await command.execute(interaction);
		}
		catch (error) {
			const errorEmbed = new Discord.MessageEmbed()
				.setTitle('Error')
				.setColor('#ff0000')
				.setDescription(`An error occured while executing the command ${command.name}:\n${error?.myMessage ?? 'Error message undefined'}`)
				.setImage('https://http.cat/' + (error?.code ?? 500));
			console.error(`Error executing ${command.name}:\n${error}`);
			if (ownerids.includes(interaction.user.id)) errorEmbed.setDescription(`An error occured while executing the command ${command.name}\n\n\`\`\`error\n${error?.stack ?? error.message}\n\`\`\``);
			await interaction.reply({ ephemeral: true, embeds: [errorEmbed] });
			if (error.report !== false) {
				errorEmbed.setDescription(`An error occured while executing the command ${command.name}\n\n\`\`\`error\n${error?.stack ?? error.message}\n\`\`\``);
				await interaction.client.channels.cache.get(errorChannel).send({ embeds: [errorEmbed], components: [row] });
			}
		}
	},
};