const Discord = require('discord.js');
const mongoose = require('mongoose');
const Addcard = require('../models/addcard.js');
const Report = require('../models/report.js');
userid = '';
var userdust = '';
var usercardname = '';

var cardscore = '';
var imgurl = '';
let confirm = '';
let upgrade;

exports.run = async (client, message, args) => {
	if (!args[0]) {
		return message.reply(' Please provide cardid to upgrade ❗ ');
	}

	userid = await message.author.id;
	cardid = args[0];
	console.log(`card id in beginning ${cardid}`);
	await Report.findOne({ userid: userid }).then(data => {
		console.log();

		mydust = data.dust;
		data.cardstats.forEach((item, i) => {
			if (item.cardid === cardid) {
				console.log('matched');
				cardname = item.cardname;
				cardscore = item.cardscore;
				imgurl = item.imgurl;
			}

			console.log(imgurl);
		});
	});

	if (mydust < 5) {
		return message.reply(
			`🔴 You don\`t have enough dust to upgrade this card. Collect atleast 5 dust by burning your cards. 🔴`
		);
	}

	const newEmbed = new Discord.MessageEmbed().setTitle('Card upgrade confirmation');
	newEmbed.addField(
		` \u200B`,
		`***<@${userid}> you are about to upgrade \`\`${cardname}\`\` and spell it with more power! you will be charged \`\`5\`\` dust for it. Confirm this upgrade by reacting to \`\`👍\`\`. You have 10 seconds.*** `
	);
	newEmbed.setImage(imgurl);
	newEmbed.setColor('#0099ff');

	var array1 = [];
	const burnmsg = await message.reply(newEmbed);

	burnmsg.react('👍').then(() => burnmsg.react('👎'));

	const filter = (reaction, user) => {
		return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
	};

	burnmsg
		.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
		.then(collected => {
			const reaction = collected.first();

			if (reaction.emoji.name === '👍') {
				Report.findOne({ userid: userid }).then(function (datawegot) {
					datawegot.cardstats.forEach((item, i) => {
						if (item.cardtype === 'Common') {
							if (item.upgrade > 4) {
								let basescore;
								if (item.cardtype === 'Common') {
									basescore = 1;
								}
								if (item.cardtype === 'Uncommon') {
									basescore = 2;
								}
								if (item.cardtype === 'Rare') {
									basescore = 3;
								}
								if (item.cardtype === 'Epic') {
									basescore = 4;
								}
								if (item.cardtype === 'Legendary') {
									basescore = 5;
								}

								console.log('this code was executed');
								const newEmbed = new Discord.MessageEmbed().setTitle(
									'🔴 You have reached maximum upgrades on this card 🔴'
								);

								array1.push(`***Cardname :*** \`\`${item.cardname}\`\` `);
								array1.push(`***Series :*** \`\`${item.series}\`\` `);
								array1.push(`***Cardtype :*** \`\`${item.cardtype}\`\` `);
								array1.push(
									`***Cardscore :*** \`\`${basescore}\`\` + \`\`${item.cardscore - basescore}\`\`  `
								);
								array1.push(`***Upgrades :*** \`\`${item.upgrade}\`\` `);
								array1.push(`***Element :*** \`\`${item.element}\`\` `);
								array1.push(
									`***Strength :*** \`\`${item.strength}\`\` \u200B \u200B ***Endurance :*** \`\`${item.endurance}\`\` \u200B \u200B  ***Vitality :*** \`\`${item.vitality}\`\`  `
								);
								array1.push(
									`***Leadership :*** \`\`${item.leadership}\`\` \u200B \u200B ***Intellect :*** \`\`${item.intellect}\`\` `
								);
								newEmbed.addField(`card info:`, array1);
								newEmbed.setColor('#0099ff');
								newEmbed.setThumbnail(item.imgurl);
								burnmsg.edit(newEmbed);

								return;
							}
						}
						if (item.cardtype === 'Uncommon') {
							if (item.upgrade > 4) {
								let basescore;
								if (item.cardtype === 'Common') {
									basescore = 1;
								}
								if (item.cardtype === 'Uncommon') {
									basescore = 2;
								}
								if (item.cardtype === 'Rare') {
									basescore = 3;
								}
								if (item.cardtype === 'Epic') {
									basescore = 4;
								}
								if (item.cardtype === 'Legendary') {
									basescore = 5;
								}

								console.log('this code was executed');
								const newEmbed = new Discord.MessageEmbed().setTitle(
									'🔴 You have reached maximum upgrades on this card 🔴'
								);

								array1.push(`***Cardname :*** \`\`${item.cardname}\`\` `);
								array1.push(`***Series :*** \`\`${item.series}\`\` `);
								array1.push(`***Cardtype :*** \`\`${item.cardtype}\`\` `);
								array1.push(
									`***Cardscore :*** \`\`${basescore}\`\` + \`\`${item.cardscore - basescore}\`\`  `
								);
								array1.push(`***Upgrades :*** \`\`${item.upgrade}\`\` `);
								array1.push(`***Element :*** \`\`${item.element}\`\` `);
								array1.push(
									`***Strength :*** \`\`${item.strength}\`\` \u200B \u200B ***Endurance :*** \`\`${item.endurance}\`\` \u200B \u200B  ***Vitality :*** \`\`${item.vitality}\`\`  `
								);
								array1.push(
									`***Leadership :*** \`\`${item.leadership}\`\` \u200B \u200B ***Intellect :*** \`\`${item.intellect}\`\` `
								);
								newEmbed.addField(`card info:`, array1);
								newEmbed.setColor('#0099ff');
								newEmbed.setThumbnail(item.imgurl);
								burnmsg.edit(newEmbed);

								return;
							}
						}
						if (item.cardtype === 'Rare') {
							if (item.upgrade > 4) {
								let basescore;
								if (item.cardtype === 'Common') {
									basescore = 1;
								}
								if (item.cardtype === 'Uncommon') {
									basescore = 2;
								}
								if (item.cardtype === 'Rare') {
									basescore = 3;
								}
								if (item.cardtype === 'Epic') {
									basescore = 4;
								}
								if (item.cardtype === 'Legendary') {
									basescore = 5;
								}

								console.log('this code was executed');
								const newEmbed = new Discord.MessageEmbed().setTitle(
									'🔴 You have reached maximum upgrades on this card 🔴'
								);

								array1.push(`***Cardname :*** \`\`${item.cardname}\`\` `);
								array1.push(`***Series :*** \`\`${item.series}\`\` `);
								array1.push(`***Cardtype :*** \`\`${item.cardtype}\`\` `);
								array1.push(
									`***Cardscore :*** \`\`${basescore}\`\` + \`\`${item.cardscore - basescore}\`\`  `
								);
								array1.push(`***Upgrades :*** \`\`${item.upgrade}\`\` `);
								array1.push(`***Element :*** \`\`${item.element}\`\` `);
								array1.push(
									`***Strength :*** \`\`${item.strength}\`\` \u200B \u200B ***Endurance :*** \`\`${item.endurance}\`\` \u200B \u200B  ***Vitality :*** \`\`${item.vitality}\`\`  `
								);
								array1.push(
									`***Leadership :*** \`\`${item.leadership}\`\` \u200B \u200B ***Intellect :*** \`\`${item.intellect}\`\` `
								);
								newEmbed.addField(`card info:`, array1);
								newEmbed.setColor('#0099ff');
								newEmbed.setThumbnail(item.imgurl);
								burnmsg.edit(newEmbed);

								return;
							}
						}
						if (item.cardtype === 'Epic') {
							if (item.upgrade > 4) {
								let basescore;
								if (item.cardtype === 'Common') {
									basescore = 1;
								}
								if (item.cardtype === 'Uncommon') {
									basescore = 2;
								}
								if (item.cardtype === 'Rare') {
									basescore = 3;
								}
								if (item.cardtype === 'Epic') {
									basescore = 4;
								}
								if (item.cardtype === 'Legendary') {
									basescore = 5;
								}

								console.log('this code was executed');
								const newEmbed = new Discord.MessageEmbed().setTitle(
									'🔴 You have reached maximum upgrades on this card 🔴'
								);

								array1.push(`***Cardname :*** \`\`${item.cardname}\`\` `);
								array1.push(`***Series :*** \`\`${item.series}\`\` `);
								array1.push(`***Cardtype :*** \`\`${item.cardtype}\`\` `);
								array1.push(
									`***Cardscore :*** \`\`${basescore}\`\` + \`\`${item.cardscore - basescore}\`\`  `
								);
								array1.push(`***Upgrades :*** \`\`${item.upgrade}\`\` `);
								array1.push(`***Element :*** \`\`${item.element}\`\` `);
								array1.push(
									`***Strength :*** \`\`${item.strength}\`\` \u200B \u200B ***Endurance :*** \`\`${item.endurance}\`\` \u200B \u200B  ***Vitality :*** \`\`${item.vitality}\`\`  `
								);
								array1.push(
									`***Leadership :*** \`\`${item.leadership}\`\` \u200B \u200B ***Intellect :*** \`\`${item.intellect}\`\` `
								);
								newEmbed.addField(`card info:`, array1);
								newEmbed.setColor('#0099ff');
								newEmbed.setThumbnail(item.imgurl);
								burnmsg.edit(newEmbed);

								return;
							}
						}
						if (item.cardtype === 'Legendary') {
							if (item.upgrade > 4) {
								let basescore;
								if (item.cardtype === 'Common') {
									basescore = 1;
								}
								if (item.cardtype === 'Uncommon') {
									basescore = 2;
								}
								if (item.cardtype === 'Rare') {
									basescore = 3;
								}
								if (item.cardtype === 'Epic') {
									basescore = 4;
								}
								if (item.cardtype === 'Legendary') {
									basescore = 5;
								}

								console.log('this code was executed');
								const newEmbed = new Discord.MessageEmbed().setTitle(
									'🔴 You have reached maximum upgrades on this card 🔴'
								);

								array1.push(`***Cardname :*** \`\`${item.cardname}\`\` `);
								array1.push(`***Series :*** \`\`${item.series}\`\` `);
								array1.push(`***Cardtype :*** \`\`${item.cardtype}\`\` `);
								array1.push(
									`***Cardscore :*** \`\`${basescore}\`\` + \`\`${item.cardscore - basescore}\`\`  `
								);
								array1.push(`***Upgrades :*** \`\`${item.upgrade}\`\` `);
								array1.push(`***Element :*** \`\`${item.element}\`\` `);
								array1.push(
									`***Strength :*** \`\`${item.strength}\`\` \u200B \u200B ***Endurance :*** \`\`${item.endurance}\`\` \u200B \u200B  ***Vitality :*** \`\`${item.vitality}\`\`  `
								);
								array1.push(
									`***Leadership :*** \`\`${item.leadership}\`\` \u200B \u200B ***Intellect :*** \`\`${item.intellect}\`\` `
								);
								newEmbed.addField(`card info:`, array1);
								newEmbed.setColor('#0099ff');
								newEmbed.setThumbnail(item.imgurl);
								burnmsg.edit(newEmbed);

								return;
							}
						}
						console.log(item.cardid);

						if (item.cardid === args[0]) {
							console.log('HEWLOOO');
							datawegot.dust = datawegot.dust - 5;
							console.log(datawegot.dust);
							cardname = item.cardname;
							cardscore = item.cardscore;
							imgurl = item.imgurl;
							item.cardscore = item.cardscore * 2;
							item.upgrade = item.upgrade + 1;
							upgrade = item.upgrade;
							newscore = cardscore + upgrade;

							const okEmbed = new Discord.MessageEmbed().setTitle('Card upgrade');
							okEmbed.addField(
								` \u200B`,
								` **<@${userid}> just upgraded \`\`${cardname}\`\`  and increased the cardscore to  \`\`${item.cardscore}\`\` points** `
							);
							okEmbed.setColor('#32CD32');
							okEmbed.setImage(imgurl);

							burnmsg.edit(okEmbed);
						}
					});
					datawegot
						.save()
						.then(resultadd => console.log('test'))
						.catch(err => console.log(err));
				});
			} else {
				message.reply('Card upgrade ritual has been called off :(');
			}
		})
		.catch(collected => {
			console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
			message.reply("you didn't react with neither a thumbs up, nor a thumbs down.");
		});

	cardid = '';
};

exports.help = {
	name: 'upgrade'
};
