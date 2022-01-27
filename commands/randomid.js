const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'randomid', // command name
	description: 'Generates a random person.', // command description
	args: false, // needs arguments?
	usage: '', // usage instructions w/o command name and prefix
	guildOnly: false, // execute in a guild only?
	cooldown: 10, // cooldown in seconds, defaults to 3
	permissions: [], // permissions required for command
	ownerOnly: false, // need to be the owner? delete line if no
	disabled: false, // command disabled to all? delete line if no
	aliases: ['randomperson'], // aliases for command
	execute(message) { // inside here command stuff
		const personsettings = { method: 'Get' };
		const personurl = 'https://randomuser.me/api/'; // random person api
		fetch(personurl, personsettings)
			.then(res => res.json())
			.then((json) => {
				const data = json.results[0];
				const idembed = new Discord.MessageEmbed()
					.setTitle(data.name.first + ' ' + data.name.last)
					.addFields(
						{ name: 'Name', value: `Name: ${data.name.first + ' ' + data.name.last}\nTitle: ${data.name.title}` },
						{ name: 'Location', value: `Street: ${data.location.street.number + ' ' + data.location.street.name}\nCity: ${data.location.city}\nState: ${data.location.state}\nPost code: ${data.location.postcode}\nCountry: ${data.location.country}\nCoordinates: ${data.location.coordinates.latitude} latitude, ${data.location.coordinates.longitude} longitude\nTime zone offset: ${data.location.timezone.offset}\nTime zone description: ${data.location.timezone.description}` },
						{ name: 'Email', value: `Email: ${data.email}` },
						{ name: 'Login', value: `Username: ${data.login.username}\nPassword: ${data.login.password}\nUUID: ${data.login.uuid}\nSalt: ${data.login.salt}\nMD5: ${data.login.md5}\nSHA1: ${data.login.sha1}\nSHA256: ${data.login.sha256}` },
						{ name: 'Birthday', value: `Date: ${data.dob.date}\nAge: ${data.dob.age}` },
						{ name: 'Registered', value: `Date: ${data.registered.date}\nAge: ${data.registered.age}` },
						{ name: 'Phone', value: `Phone: ${data.phone}\nCell: ${data.cell}` },
						{ name: 'ID', value: `Name: ${data.id.name}\nValue: ${data.id.value}` },
						{ name: 'Disclaimer', value: 'The information given in this embed is fictitious. No identification with actual persons (living or deceased), places, buildings, and products is intended or should be inferred. The information here is provided by [randomuser.me](https://randomuser.me/)' },
					)
					.setThumbnail(data.picture.thumbnail)
					.setColor('RANDOM');
				message.reply({ embeds: [idembed] });
			});
	},
};