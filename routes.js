const express = require('express');
const router = express.Router();

const { invite, topggAuth } = require('./config.json');
const client = require('./index.js');
const vote = require('./events/vote.js');

router.route('/invite').get((req, res) => {
	res.redirect(invite);
});

router.route('/docs').get((req, res) => {
	const docs = require('./web/docs.json');
	if (!docs[req.query.page]) {
		res.redirect('/404');
	}
	else {
		res.redirect(docs[req.query.page]);
	}
});

router.route('/shorts').get(async (req, res) => {
	const urls = process.shortUrls;
	if
	(urls[req.query.id]) {
		res.redirect(urls[req.query.id]);
	}
	else {
		res.redirect(urls.unknown);
	}
});

router.route('/404').get((req, res) => {
	res.sendFile(__dirname + '/web/404.html');
});

router.route('/').get((req, res) => {
	res.sendFile(__dirname + '/web/index.html');
});

router.route('/api/tggwh').post((req, res) => {
	if (req.header('authorization') === topggAuth) {
		vote.execute(client, req.body);
		res.status(200).end();
	}
	else {
		console.log('Unauthorized vote request attempt.');
		res.send('Unauthorized');
		res.status(401).end();
	}
});

router.route('*').all((req, res) => {
	res.redirect('/404');
});

module.exports = router;