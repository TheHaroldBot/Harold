const Discord = require('discord.js');

module.exports = {
	name: 'setavatar', //command name
	description: "Sets the bot's profile image.", //command description
	args: true, //needs arguments? delete line if no
    usage: `<image url>`, //usage instructions w/o command name and prefix
	cooldown: 5, //cooldown in seconds, defaults to 3
	ownerOnly: true, //need to be the owner? delete line if no
	aliases: ['setprofile', 'setpfp'],
	execute(message, args, prefix, user) { //inside here command stuff
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
           '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        if(pattern.test(args[0]) === false) return(message.channel.send('Invalid url, check for spelling errors and try again.'))
		message.client.user.setAvatar(args[0])
		message.channel.send('Avatar changed')
	},
};