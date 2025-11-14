const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, MessageFlags } = require('discord.js');
const { isValidImageURL } = require('../functions');

module.exports = {
	name: 'embed', // command name
	description: 'Send an embed. You can use the built-in options or use raw JSON data for futher customization.\nBuild an embed here: https://eb.nadeko.bot/ then copy the JSON code on the right.', // command description
	usage: '<guided | raw>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	myPermissions: [PermissionFlagsBits.SendMessages], // permissions bot needs for command
	args: true,
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Send an embed using JSON data.')
		.addSubcommand(subcommand =>
			subcommand.setName('raw')
				.setDescription('Send an embed using raw JSON data.')
				.addStringOption(option =>
					option.setName('json')
						.setRequired(true)
						.setDescription('The JSON code for the embed.')),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('guided')
				.setDescription('Send an embed using guided options.')
				.addStringOption(option =>
					option.setName('title')
						.setRequired(false)
						.setDescription('The title of the embed.')
						.setMaxLength(256))
				.addStringOption(option =>
					option.setName('description')
						.setRequired(false)
						.setDescription('The description of the embed.')
						.setMaxLength(4096))
				.addStringOption(option =>
					option.setName('author')
						.setRequired(false)
						.setDescription('The author of the embed.')
						.setMaxLength(256))
				.addStringOption(option =>
					option.setName('footer')
						.setRequired(false)
						.setDescription('The footer of the embed.')
						.setMaxLength(2048))
				.addStringOption(option =>
					option.setName('color')
						.setRequired(false)
						.setDescription('The color of the embed in hex code. (e.g. #ff0000)')
						.setAutocomplete(true))
				.addStringOption(option =>
					option.setName('image')
						.setRequired(false)
						.setDescription('The image URL of the embed.')
						.setAutocomplete(true))
				.addStringOption(option =>
					option.setName('thumbnail')
						.setRequired(false)
						.setDescription('The thumbnail URL of the embed.')
						.setAutocomplete(true))
				.addIntegerOption(option =>
					option.setName('timestamp')
						.setRequired(false)
						.setDescription('Set the timestamp to a specific epoch time **in milliseconds**.')
						.setMinValue(0))
				.addStringOption(option =>
					option.setName('url')
						.setRequired(false)
						.setDescription('The URL of the embed.')
						.setAutocomplete(true)),
		),
	autoComplete: async (interaction) => {
		const currentValue = interaction.options.getFocused();
		const optionName = interaction.options.getFocused(true).name;
		const toRespond = [];
		if (optionName === 'color') {
			const validColors = ['default', 'white', 'aqua', 'green', 'blue', 'yellow', 'purple', 'luminousvividpink', 'fuchsia', 'gold', 'orange', 'red', 'grey', 'navy', 'darkaqua', 'darkgreen', 'darkblue', 'darkpurple', 'darkvividpink', 'darkgold', 'darkorange', 'darkred', 'darkgrey', 'darkergrey', 'lightgrey', 'darknavy', 'blurple', 'greyple', 'darkbutnotblack', 'notquiteblack', 'random'];
			if (validColors.includes(currentValue.toLowerCase())) {
				toRespond.push({ name: currentValue, value: currentValue });
			}
			if (/^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(currentValue)) {
				toRespond.push({ name: `Hex: ${currentValue}`, value: currentValue });
			}
		} else if (optionName === 'image' || optionName === 'thumbnail' || optionName === 'url') {
			if (isValidImageURL(currentValue)) {
				toRespond.push({ name: currentValue, value: currentValue });
			}
		}
		return toRespond;
	},

	async execute(interaction) { // inside here command stuff
		if (interaction.options.getSubcommand() === 'raw') {
			const data = interaction.options.getString('json');
			try {
				const embedjson = await JSON.parse(data);
				await interaction.channel.send(embedjson);
				await interaction.reply({ content: 'Sent!', flags: MessageFlags.Ephemeral });
			} catch (error) {
				console.log('Failed to send a custom embed!');
				console.error(error);
				const errorembed = await new EmbedBuilder()
					.setTitle('Error!')
					.setDescription('\nSomething went wrong! There are a few possible issues:\n1. You tried to put text in a link option (Like putting \'hello\' in the image option, or \'never gonna give you up\' in the thumbnail option.)\n2. You didn\'t actually include an embed. \n3. Something else\nI\'ll attatch the error below.\nIf this issue seems like a bug, use the /bugreport command to report it.')
					.addFields([
						{ name: 'Error Message', value: `>>> ${error.toString()}` },
					])
					.setColor('#ff0000');
				await interaction.reply({ embeds: [errorembed], flags: MessageFlags.Ephemeral });
			}
		} else if (interaction.options.getSubcommand() === 'guided') {
			try {
				let color = null;
				if (interaction.options.getString('color')) {
					color = interaction.options.getString('color');
					color = color.toLowerCase()
						.split(' ')
						.map(
							word => word.charAt(0).toUpperCase() + word.slice(1),
						)
						.join(' ');
				}
				const embed = new EmbedBuilder()
					.setTitle(interaction.options.getString('title') || null)
					.setDescription(interaction.options.getString('description') || null)
					.setAuthor({ name: interaction.options.getString('author') || null })
					.setFooter({ text: interaction.options.getString('footer') || null })
					.setColor(color)
					.setImage(interaction.options.getString('image') || null)
					.setThumbnail(interaction.options.getString('thumbnail') || null)
					.setTimestamp(interaction.options.getInteger('timestamp') || null)
					.setURL(interaction.options.getString('url') || null);
				await interaction.channel.send({ embeds: [embed] });
				await interaction.reply({ content: 'Sent!', flags: MessageFlags.Ephemeral });
			} catch (error) {
				const errorembed = await new EmbedBuilder()
					.setTitle('Error!')
					.setDescription('\nSomething went wrong! There are a few possible issues:\n1. You tried to put text in a link option (Like putting \'hello\' in the image option, or \'never gonna give you up\' in the thumbnail option.)\n2. You didn\'t actually include an embed. \n3. Something else\nI\'ll attatch the error below.\nIf this issue seems like a bug, use the /bugreport command to report it.')
					.addFields([
						{ name: 'Error Message', value: `>>> ${error.toString()}` },
					])
					.setColor('#ff0000');
				await interaction.reply({ embeds: [errorembed], flags: MessageFlags.Ephemeral });
			}
		}
	},
};
