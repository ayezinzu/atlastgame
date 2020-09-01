const Discord = require('discord.js');
const mongoose = require("mongoose");
const Addcard = require("../models/addcard.js")
const Report = require("../models/report.js")
var userid = ""
var userdust = ""
var usercardname = ""

var cardscore = ""
var imgurl = ""
let confirm = ""


exports.run = async (client,message,args) => {
  if(!args[0]){
    return message.reply(" Please provide cardid to burn ❗ ")
  }
 userid = await message.author.id
   cardid = args[0]

   await Report.findOne({userid: userid}).then( (data) => {

   data.cardstats.forEach((item, i) => {
     if(item.cardid === cardid){

       cardname = item.cardname
       cardscore = item.cardscore
       imgurl = item.imgurl


     }
console.log(imgurl);

   });


   } )



      const newEmbed = new Discord.MessageEmbed().setTitle('Card burn confirmation')
      newEmbed.addField(` \u200B`, `***Oh no ! <@${userid}> you are about to burn \`\`${cardname}\`\` to ashes ! you will get \`\`${cardscore}\`\` dust from it. Confirm this brutal act by reacting to \`\`👍\`\`. You have 10 seconds.*** `, )
      newEmbed.setImage(imgurl)
      newEmbed.setColor('#0099ff')





 const burnmsg = await message.reply(newEmbed)

 burnmsg.react('👍').then(() => burnmsg.react('👎'));

 const filter = (reaction, user) => {
     return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
 };

 burnmsg.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
     .then(collected => {
         const reaction = collected.first();


         if (reaction.emoji.name === '👍') {
           Report.findOne({userid: userid }).then(function(datawegot){


             datawegot.cardstats.forEach( (item, i) => {

              if(item.cardid === cardid){

                  datawegot.dust = item.cardscore + datawegot.dust
                  cardname = item.cardname
                  cardscore = item.cardscore
                  imgurl = item.imgurl
                        const indexofcard = datawegot.cardstats.map(function(e) { return e.cardname; }).indexOf(cardname);
                        const carccut = datawegot.cardstats.splice(indexofcard, 1);

                        const okEmbed = new Discord.MessageEmbed().setTitle('Card burn');
                        okEmbed.addField(` \u200B`, `***Riperoonie ;-; <@${userid}> just lit \`\`${cardname}\`\` on fire 🔥 and got \`\`${ cardscore}\`\` dust from it.*** `, )
                        okEmbed.setColor('#0099ff')
                        okEmbed.setImage(imgurl)

                         burnmsg.edit(okEmbed)





              }

            })
            datawegot.save().then(resultadd => console.log("test"))
            .catch(err => console.log(err));
          })

         }
         else {
             message.reply('Card burning ritual has been called off.');
         }
     })
     .catch(collected => {
         console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
         message.reply('you didn\'t react with neither a thumbs up, nor a thumbs down.');
     });







































};

exports.help = {
  name: 'burn'
};
