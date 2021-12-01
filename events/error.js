module.exports = {
	name: 'error',
	once: false,
	async execute(error) {
		console.log(`New error!\n${JSON.stringify(error)}`);
	},
};