const Discord = require('discord.js');
const mongoose = require("mongoose");
const Canvas = require('canvas');

const Addcard = require("../models/addcard.js")
const Report = require("../models/report.js")


let cardname
let imgurl
let cardtype
let cardscore
let element
let strength
let upgrade
let cardid
let vitality
let endurance
let leadership
let intellect
let series

let cardname11
let imgurl11
let cardtype11
let cardscore11
let element11
let strength11
let upgrade11
let cardid11
let vitality11
let endurance11
let leadership11
let intellect11
let series11

exports.run = async (client, message, args) => {
  if(args.length < 2){
    message.channel.send(`Invalid command usage.`)
    return
  }

  const userid = await message.author.id
  var cardid = args[0]
  const userid1 = message.mentions.members.first().id

  var cardid1 = args[2]

  await Report.findOne({
    userid: userid
  }).then((data, err) => {
    if(err){
      message.channel.send(`Wrong card id. Please try again.`)
      return
    }
    if(data){
      data.cardstats.forEach((item, i) => {
        if (item.cardid === cardid) {
  
          cardname = item.cardname
          cardscore = item.cardscore
          imgurl = item.imgurl
          upgrade = item.upgrade
          series = item.series
  
  
  
        }
        console.log(imgurl);
  
      });
    }

   


  })

  await Report.findOne({
    userid: userid1
  }).then((data, err) => {
    if(err) {
      message.channel.send(`Wrong card id. Please try again. `)
      return
    }
    if(data) {
      data.cardstats.forEach((item, i) => {
        if (item.cardid === cardid1) {
  
          cardname1 = item.cardname
          cardscore1 = item.cardscore
          imgurl1 = item.imgurl
          upgrade1 = item.upgrade
          series11 = item.series
  
  
  
        }
        console.log(imgurl);
  
      });
    }
  


  })


  console.log(userid1);
  const newEmbed = new Discord.MessageEmbed().setTitle('Trade confirmation')
  const canvas = Canvas.createCanvas(3500, 2500);
  // ctx (context) will be used to modify a lot of the canvas

  const ctx = canvas.getContext('2d');



  // Wait for Canvas to load the image
  const avatar = await Canvas.loadImage(imgurl);
  const avatar1 = await Canvas.loadImage(imgurl1);
  const exchange = await Canvas.loadImage("https://addisbanksc.com/wp-content/uploads/2016/01/transfer.png");
  const traderone = await Canvas.loadImage(message.author.avatarURL({
    format: 'png'
  }));
  const tradertwo = await Canvas.loadImage(message.mentions.users.first().displayAvatarURL({
    format: 'png'
  }));
  // Draw a shape onto the main canvas
  // Pick up the pen
  ctx.drawImage(traderone, 550, 2000, 350, 350);
  ctx.drawImage(tradertwo, 2500, 2000, 350, 350);
  ctx.drawImage(exchange, 1400, 700, 600, 600);
  ctx.drawImage(avatar, 225, 40, 1000, 1750);

  ctx.drawImage(avatar1, 2200, 40, 1000, 1750);




          var newcardid = Math.random().toString(20).substr(2, 6)
          var newcardid11 = Math.random().toString(20).substr(2, 6)

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');


  newEmbed.addField(` \u200B`, `***Heyo <@${userid1}> your friend <@${userid}> wants to give you \`\`${cardname}\`\` worth \`\`${cardscore+upgrade}\`\` pts  in return of \`\`${cardname1}\`\` worth \`\`${cardscore1+upgrade1}\`\`pts. To accept this trade react to \`\`👍\`\`. You have 10 seconds.*** `)
  newEmbed.attachFiles([attachment])
  newEmbed.setImage("attachment://welcome-image.png")
  newEmbed.setColor('#0099ff')

  const tradeEmbed = new Discord.MessageEmbed().setTitle('Trade Details')
  tradeEmbed.addField(`\u200B`, ` <@${userid}> recieved \n**\`\`${newcardid11}\`\` - ${cardname1} - ${cardscore1+upgrade1} pts - ${series11}**`)
  tradeEmbed.addField(`\u200B`, ` <@${userid1}> recieved \n**\`\`${newcardid}\`\` - ${cardname} - ${cardscore+upgrade} pts - ${series}**`)
  tradeEmbed.addField(`\u200B`, `**The trade has been accepted.**`)
  tradeEmbed.setColor('#00FF00')

  const tradecancelEmbed = new Discord.MessageEmbed().setTitle('Trade Details')
  tradecancelEmbed.addField(`\u200B`, ` <@${userid}> did not recieve \n**\`\`${cardid1}\`\` - ${cardname1} - ${cardscore1+upgrade1} pts - ${series11}**`)
  tradecancelEmbed.addField(`\u200B`, ` <@${userid1}> did not recieve \n**\`\`${cardid}\`\` - ${cardname} - ${cardscore+upgrade} pts - ${series}**`)
  tradecancelEmbed.addField(`\u200B`, `**The trade has been cancelled.**`)
  tradecancelEmbed.setColor('	#FF0000')


  const burnmsg = await message.reply(newEmbed)

  burnmsg.react('👍').then(() => burnmsg.react('👎'));

  const filter = (reaction, user) => {
    return ['👍', '👎'].includes(reaction.emoji.name) && [message.author.id, message.mentions.members.first().id].includes(user.id);
  };

  burnmsg.awaitReactions(filter, {
      max: 2,
      time: 10000,
      errors: ['time']
    })

    .then(async collected => {
      const reaction = collected.first();
      console.log(`this is ${reaction}`);
if (reaction.emoji.name === `👎`){

  message.channel.send(tradecancelEmbed)
  return

}

      if (reaction.emoji.name === '👍') {


        const user_one = await Report.findOne({
          userid: userid
        })
        const user_two = await Report.findOne({
          userid: userid1
        })
        // USER 1 SAVE INFO AND DELETE

        user_one.cardstats.forEach((item, i) => {
          if (cardid === item.cardid) {
            cardname = item.cardname;
            imgurl = item.imgurl;
            cardtype = item.cardtype;
            cardscore = item.cardscore;
            element = item.element;
            strength = item.strength;
            upgrade = item.upgrade
            vitality = item.vitality;
            endurance = item.endurance;
            leadership = item.leadership;
            intellect = item.intellect;
            series = item.series;
          }

        });
        const indexOfUserOne = user_one.cardstats.map(function(emy) {
          return emy.cardid;
        }).indexOf(cardid);
        user_one.cardstats.splice(indexOfUserOne, 1);
        user_one.save().then(resultadd => console.log("saved data"))
          .catch(err => console.log(err));

        // USER 2 SAVE INFO AND DELETE
        user_two.cardstats.forEach((item, i) => {
          if (cardid1 === item.cardid) {
            cardname11 = item.cardname;
            imgurl11 = item.imgurl;
            cardtype11 = item.cardtype;
            cardscore11 = item.cardscore;
            element11 = item.element;
            strength11 = item.strength;
            upgrade11 = item.upgrade
            vitality11 = item.vitality;
            endurance11 = item.endurance;
            leadership11 = item.leadership;
            intellect11 = item.intellect;
            series11 = item.series;
          }
        });
        const indexOfUserTwo = user_two.cardstats.map(function(my) {
          return my.cardid;
        }).indexOf(cardid1);
        user_two.cardstats.splice(indexOfUserTwo, 1);
        user_two.save().then(resultf => console.log("saved data"))
          .catch(err => console.log(err));

        user_one.cardstats.push({
          upgrade: upgrade11,
          cardid: newcardid11,
          cardname: cardname11,
          cardtype: cardtype11,
          cardscore: cardscore11,
          element: element11,
          strength: strength11,
          endurance: endurance11,
          vitality: vitality11,
          leadership: leadership11,
          intellect: intellect11,
          series: series11,
          imgurl: imgurl11
        })
        user_one.save().then(resultf => console.log("saved data"))
          .catch(err => console.log(err));

        user_two.cardstats.push({
          upgrade: upgrade,
          cardid: newcardid,
          cardname: cardname,
          cardtype: cardtype,
          cardscore: cardscore,
          element: element,
          strength: strength,
          endurance: endurance,
          vitality: vitality,
          leadership: leadership,
          intellect: intellect,
          series: series,
          imgurl: imgurl
        })
        user_two.save().then(resultadd => console.log("saved data"))
          .catch(err => console.log(err));





        message.channel.send(tradeEmbed)

      } else {
        message.channel.send(tradecancelEmbed)
        return
      }
    })
    .catch(collected => {
      console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
      message.channel.send(tradecancelEmbed)
    });









};

exports.help = {
  name: 'trade'
};
