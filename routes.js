const express = require('express');
const router = express.Router();

const { invite } = require('./config.json');

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

router.route('*').all((req, res) => {
	res.redirect('/404');
});

module.exports = router;