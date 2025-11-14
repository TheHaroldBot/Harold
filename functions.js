const fs = require('fs');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

/**
	* Logs a command usage to the usage file.
	* @param { JSON } command - If no command can be provided, use `{ name: "name" }`
*/
function logUsage(command) {
	const usage = JSON.parse(fs.readFileSync('./usage.json', 'utf8'));
	usage[command.name] = usage[command.name] ? usage[command.name] + 1 : 1;
	fs.writeFileSync('./usage.json', JSON.stringify(usage, null, 4));
}

/**
	* Creates a random string of letters and numbers
	* @param { number } length - The length of the generated string.
*/
function makeid(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

/**
	* Reloads the short urls into the process
*/
async function refreshShortUrls() {
	try {
		const newUrls = JSON.parse(fs.readFileSync('./shorturls.json', 'utf8'));
		if (process.shortUrls) {
			await delete process.shortUrls;
		}
		process.shortUrls = newUrls;
		console.log('Refreshed short URls!');
	} catch (error) {
		return error;
	}
}

/**
	* Reloads the config file into the process
*/
async function refreshConfig() {
	try {
		const newConfig = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
		if (process.haroldConfig) {
			await delete process.haroldConfig;
		}
		process.haroldConfig = newConfig;
		console.log('Refreshed config!');
	} catch (error) {
		return error;
	}
}
/**
	* Gets a reddit post
	* @param { string } subreddit - The subreddit to get, defaults to random.
	* @param { boolean } allowNSFW - Whether to allow NSFW or not, defaults to false.
	* @returns { Array } Returns an array of posts and prebuilt embeds.
*/
async function getRedditPost(subreddit, allowNSFW) {
	const response = await fetch(`https://www.reddit.com/r/${subreddit ?? 'random'}.json`, { method: 'Get' });
	const responsejson = await response.json();
	const posts = responsejson.data.children;
	const post = posts[Math.floor(Math.random() * posts.length)];
	let type = post.data.post_hint;

	let title = post.data.title;
	const permalink = post.data.permalink;
	const url = `https://reddit.com${permalink}`;
	const image = post.data.url;
	const upvotes = post.data.ups;
	const comments = post.data.num_comments;
	const nsfw = post.data.over_18;
	const description = post.data.selftext;
	const author = `u/${post.data.author}`;
	const posttime = post.data.created * 1000;
	const footer = `👍 ${upvotes} 💬 ${comments} • r/${post.data.subreddit}`;
	if (nsfw === true) {
		title = `[NSFW] ${title}`;
	}
	if (post.data.is_gallery) return 'Gallery post rejected.';
	if (!type) type = 'text';
	if (type !== 'text' && type !== 'image') return 'Unsupported post type.';
	const redditembed = new EmbedBuilder()
		.setTitle(title)
		.setURL(url)
		.setColor('Random')
		.setFooter({ text: footer })
		.setTimestamp(posttime)
		.setAuthor({ name: author, iconURL: `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 7)}.png`, url: `https://reddit.com/${author}` });
	if (type === 'image') {
		redditembed.setImage(image);
	} else if (type === 'text') {
		redditembed.setDescription(description ?? '(No description.)');
	} else {
		return;
	}

	if (nsfw === true && allowNSFW !== true) return;

	const returnPost = {
		title,
		permalink,
		url,
		upvotes,
		comments,
		nsfw,
		description,
		author,
		posttime,
		footer,
		redditembed,
		type,
	};
	return returnPost;
}

function isValidURL(string) {
	try {
		new URL(string);
		return true;
	} catch {
		return false;
	}
}

function isValidImageURL(string) {
	if (!isValidURL(string)) return false;
	return /\.(png|jpe?g|gif|webp|bmp)$/i.test(string);
}

module.exports = {
	logUsage,
	makeid,
	refreshShortUrls,
	refreshConfig,
	getRedditPost,
	isValidURL,
	isValidImageURL,
};