const { webPort } = require('../config.json');
const { refreshShortUrls } = require('../functions.js');
const fs = require('fs');
const fetch = require('node-fetch');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = webPort;
const routes = require('../routes.js');
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const options = {
	key: fs.readFileSync('./web/ssl/privatekey.pem'),
	cert: fs.readFileSync('./web/ssl/certificate.pem'),
};
https.createServer(options, app).listen(PORT, function() {
	console.log('Express server listening on port ' + PORT);
});

module.exports = {
	name: 'ready', // name, duh
	once: true, // remove if false
	async execute(client) { // stuff to do
		console.info(`Ready at: ${client.readyAt}`);
		console.info('Harold Bot Copyright (C) 2022  John Gooden');
		console.info('Copyright info: https://github.com/TheHaroldBot/Harold/blob/main/LICENSE\n\n');
		await fetch('https://api.github.com/repos/TheHaroldBot/Harold/commits', { method: 'Get' })
			.then(async response => {
				const commits = await response.json();
				const latest = commits[0];
				client.user.setActivity(`Latest update: ${latest.commit.message}`);
			});

		refreshShortUrls();
		app.use(bodyParser.json(), routes, limiter);

	},
};