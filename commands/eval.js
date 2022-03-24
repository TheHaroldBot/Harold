const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'eval', // command name
	description: 'Evaluate a string into code and run it.', // command description
	args: true, // needs arguments? delete line if no
	usage: '<code>', // usage instructions w/o command name and prefix
	cooldown: 5, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	myPermissions: [], // permissions bot needs for command
	ownerOnly: true, // need to be the owner? delete line if no
	aliases: ['run', 'code', 'script'],
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Evaluate a string into code and run it.')
		.addStringOption(option =>
			option.setName('code')
				.setRequired(true)
				.setDescription('The code to evaluate.')),

	async execute(interaction) { // inside here command stuff
		const code = interaction.options.getString('code');
		try {
			await eval(code);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: 'Thats an error there buddy!', ephemeral: true });
		}
	},
};
