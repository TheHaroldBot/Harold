/* eslint-disable no-undef */
const fs = require('fs');

function logUsage(command) {
	const usage = JSON.parse(fs.readFileSync('./usage.json', 'utf8'));
	usage[command.name] = usage[command.name] ? usage[command.name] + 1 : 1;
	fs.writeFileSync('./usage.json', JSON.stringify(usage, null, 4));
}

function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

async function refreshShortUrls() {
	try {
		const newUrls = JSON.parse(fs.readFileSync('./shorturls.json', 'utf8'));
		if (process.shortUrls) {
			await delete process.shortUrls;
		}
		process.shortUrls = newUrls;
	}
	catch (error) {
		return error;
	}
}

module.exports = { logUsage, makeid, refreshShortUrls };