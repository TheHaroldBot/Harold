module.exports = {
	name: 'ready', //name, duh
	once: true, //remove if false 
	execute(client) { //stuff to do
		console.info(`Ready at: ${client.readyAt}`)
    	console.info('Harold Bot Copyright (C) 2021  John Gooden')
    	console.info('Copyright info: https://github.com/johng3587/Harold/blob/main/LICENCE\n\n')
	},
};