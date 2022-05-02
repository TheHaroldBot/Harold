module.exports = {
	name: 'autocomplete',
	async execute(interaction) {
		if (!interaction.isAutocomplete()) return;
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command || !command.autoComplete) {
			interaction.respond([]);
			return;
		}
		const toRespond = await command.autoComplete(interaction);
		await interaction.respond(toRespond.slice(0, 24));
	},
};