const Canvas = require('canvas');
const Discord = require('discord.js');

const mongoose = require('mongoose');
const Addboss = require('../models/addboss.js');
const Report = require('../models/report.js');
const Pagination = require('discord-paginationembed');
var chunk = require('lodash.chunk');
var _ = require('lodash');

var cardname = '';
var cardtype = '';
var difficulty = 0;
var imgurl = '';
var element = '';
var strength = '';
var vitality = '';
var endurance = '';
var leadership = '';
var intellect = '';
var series = '';
var emoji = '';

var cardid = Math.random().toString(20).substr(2, 6);
exports.run = async (client, message, args) => {
	if (!message.member.roles.cache.some(r => r.name === 'Admin')) return;
	var gucci = {
		timeout: 10000,
		reason: 'myhomemyrules'
	};
	const filter = m => m.author.id === message.author.id;
	message.reply('Please enter card name..this message will expire in 20 seconds').then(r => r.delete(gucci));
	message.channel
		.awaitMessages(filter, { max: 1, time: 20000 })
		.then(collected => {
			cardname = collected.first().content;

			message.channel.send('thank you');
		})
		.then(async imgmsg => {
			message.reply(
				'Ok now post the card img url (right click on card img on discord, copy link and paste here)'
			);

			await message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
				imgurl = collected.first().content;

				message.channel.send('thank you');
			});
		})
		.then(async elementmsg => {
			message.reply('element name ?');

			await message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
				element = collected.first().content;

				message.channel.send('thank you');
			});
		})
		.then(async strengthmsg => {
			message.reply('Enter strength');

			await message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
				strength = collected.first().content;

				message.channel.send('thank you');
			});
		})
		.then(async vitalitymsg => {
			message.reply('Enter vitality');

			await message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
				vitality = collected.first().content;

				message.channel.send('thank you');
			});
		})
		.then(async endurancemsg => {
			message.reply('Enter endurance');

			await message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
				endurance = collected.first().content;

				message.channel.send('thank you');
			});
		})
		.then(async leadershipmsg => {
			message.reply('leadership');

			await message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
				leadership = collected.first().content;

				message.channel.send('thank you');
			});
		})
		.then(async intellectmsg => {
			message.reply('Enter intellect');

			await message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
				intellect = collected.first().content;

				message.channel.send('thank you');
			});
		})
		.then(async seriesmsg => {
			message.reply('Enter series name');

			await message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
				series = collected.first().content;

				message.channel.send('thank you');
			});
		})

		.then(async secondmsg => {
			message.reply('Amazing, now enter the card type ');

			await message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
				cardtype = collected.first().content;
				console.log(cardtype);

				message.channel.send('thank you');
			});
		})
		.then(async thirdmsg => {
			message.reply('hmm, now enter the card difficulty');

			await message.channel.awaitMessages(filter, { max: 1, time: 20000 }).then(collected => {
				difficulty = collected.first().content;

				message.channel.send('ok , the card has been added to our stack :)');
				const addcard = new Addboss({
					_id: mongoose.Types.ObjectId(),
					cardname: cardname,

					cardtype: cardtype,
					difficulty: difficulty,
					imgurl: imgurl,
					strength: strength,
					leadership: leadership,
					element: element,
					vitality: vitality,
					endurance: endurance,
					intellect: intellect,
					series: series
				});
				addcard
					.save()
					.then(result => console.log(result))
					.catch(err => console.log(err));
			});
		})

		.catch(err => console.log(err));
};

exports.help = {
	name: 'addb'
};
