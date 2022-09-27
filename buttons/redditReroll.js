const { getRedditPost } = require('../functions');

module.exports = {
	customId: 'redditreroll',
	permissions: [],
	myPermissions: [],
	async execute(interaction) {
		let subreddit = 0; // figure out how to get the subreddit
		if (!interaction.options.getString('subreddit')) {
			subreddit = 'random';
		}
		try {
			let pass = false;
			while (pass === false) {
				const post = getRedditPost(subreddit);
				if (post.nsfw === true && interaction.channel.nsfw !== true) {
					pass = false;
				}
				else {
					pass = true;
					await interaction.editReply({ embeds: [post.redditembed] });
				}
			}
		}
		catch (error) {
			if (error.myMessage) throw error;
			const returnError = { message: error.message, stack: error.stack, code: 404, report: false, myMessage: 'Error completing your request, did you spell the subreddit right?' };
			throw returnError;
		}
	},
};