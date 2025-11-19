const { getRedditPost, HaroldError } = require('../functions');
const { MessageFlags } = require('discord.js');

module.exports = {
	customId: 'redditreroll',
	permissions: [],
	myPermissions: [],
	async execute(interaction) {
		const footer = interaction.message.embeds[0].footer.text.split('/');
		const subreddit = footer[1];
		const components = interaction.message.components;
		try {
			let pass = false;
			let count = 0;
			while (pass === false && count < 5) {
				try {
					const post = await getRedditPost(subreddit);
					if (!post || (post.nsfw === true && interaction.channel.nsfw !== true)) {
						pass = false;
					} else {
						pass = true;
						await interaction.message.edit({ embeds: [post.redditembed], components: components });
						await interaction.deferUpdate();
					}
				} catch {
					// Continue the loop on error
				}
				count = count + 1;
			}
			if (count >= 5) await interaction.message.edit({ content: 'Something went wrong! Try again or try another subreddit.', flags: MessageFlags.Ephemeral });
		} catch (error) {
			const returnError = new HaroldError(error.message, error.stack, 500, true, 'Error completing your request, we reported this error and will look into it.');
			throw returnError;
		}
	},
};