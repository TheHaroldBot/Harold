const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'setavatar', // command name
	description: 'Sets the bot\'s profile image.', // command description
	args: true, // needs arguments? delete line if no
	usage: '<image url>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: ['SEND_MESSAGES'], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['setprofile', 'setpfp'],
	data: new SlashCommandBuilder()
		.setName('setavatar')
		.setDescription('Sets the bot\'s profile image.')
		.addStringOption(option =>
			option.setName('image')
				.setRequired(true)
				.setDescription('The image url.')),

	async execute(message, args) { // inside here command stuff
		try {
			await message.client.user.setAvatar(args[0]);
			message.reply('Avatar changed');
		}
		catch {
			message.reply('Error setting avatar, check the URL spelling and try again.');
		}
	},
};
