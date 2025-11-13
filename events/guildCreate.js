const { ButtonBuilder, EmbedBuilder, ActionRowBuilder, Events } = require('discord.js');

module.exports = {
	name: Events.GuildCreate,
	once: true,
	async execute(guild) {
		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel('GitHub')
					.setStyle('Link')
					.setEmoji('<:ghub:971219159088250900>')
					.setURL('https://github.com/TheHaroldBot/Harold'),
				new ButtonBuilder()
					.setLabel('Vote')
					.setStyle('Link')
					.setEmoji('⭐')
					.setURL('https://top.gg/bot/808750224033185794'),
			);
		const introembed = new EmbedBuilder()
			.setTitle('Hiya!')
			.setColor('Random')
			.setDescription('Thank you for adding me to your server!\nRun `/help` to get my commands!\nThings to know: I am still under developement, and will have a few bugs, feel free to report them with `/bugreport`, email us at support@theharoldbot.com, or join our [support server](https://discord.gg/xnY4SZV2Cd)\nI collect anonymous usage data to help me improve my features. Read my [privacy policy](https://github.com/TheHaroldBot/Harold/blob/main/PRIVACY) to learn more.\nBy using this bot you agree to the [Terms of Service](https://github.com/TheHaroldBot/Harold/blob/main/TERMS.md)');
		const owner = await guild.fetchOwner();
		try {
			await owner.send({ embeds: [introembed], components: [row] });
		} catch (error) {
			console.error(`
				Error sending into embed to user ${owner.id} from server ${guild.id}:
				${error}
			`);
		}
		console.info(`I just joined a new server! I am now a member of ${guild.name}`);
	},
};
