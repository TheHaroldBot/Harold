module.exports = {
	name: 'autocomplete',
	execute(interaction) {
		if (!interaction.isAutocomplete()) return;
		if (interaction.commandName === 'reload') {
			const currentValue = interaction.options.getFocused();
			if (currentValue.startsWith('Foo')) {
				interaction.respond([
					{
						name: 'Foobar',
						value: 'Foobar',
					},
					{
						name: 'Food',
						value: 'Food',
					},
				]).then(console.log).catch(console.error);
				return;
			}

			if (currentValue.startsWith('Test')) {
				interaction.respond([
					{
						name: 'Test1',
						value: 'Test1',
					},
					{
						name: 'Test2',
						value: 'Test2',
					},
				]).then(console.log).catch(console.error);
				return;
			}
		}
	},
};