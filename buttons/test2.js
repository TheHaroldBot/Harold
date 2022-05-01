module.exports = {
	customId: 'test2',
	async execute(interaction) {
		console.log('A button was pressed!' + interaction);
		interaction.reply('Got it again!');
	},
};