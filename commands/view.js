const Discord = require('discord.js');
const mongoose = require("mongoose");
const Addcard = require("../models/addcard.js")
const Report = require("../models/report.js")


exports.run = async (client,message,args) => {
if(args[1]){
userid = message.mentions.members.first().id
cardid = args[1]
var array1 = []
await Report.findOne({userid: userid }).then(function(datawegot){

  datawegot.cardstats.forEach( (item,i) => {

    if(item.cardid === cardid){
      console.log("henlo");


      const newEmbed = new Discord.MessageEmbed().setTitle('Card information')
      let basescore
      if (item.cardtype === "Common"){
        basescore = 1
      }
      if (item.cardtype === "Uncommon"){
        basescore = 2
      }
      if (item.cardtype === "Rare"){
        basescore = 3
      }
      if (item.cardtype === "Epic"){
        basescore = 4
      }
      if (item.cardtype === "Legendary"){
        basescore = 5
      }


console.log(basescore);
      array1.push(`***Cardname :*** \`\`${item.cardname}\`\` `)
      array1.push(`***Series :*** \`\`${item.series}\`\` `)
      array1.push(`***Cardtype :*** \`\`${item.cardtype}\`\` `)
      array1.push(`***Cardscore :*** \`\`${basescore}\`\` + \`\`${item.cardscore - basescore}\`\`  `)
        array1.push(`***Upgrades :*** \`\`${item.upgrade}\`\` `)
      array1.push(`***Element :*** \`\`${item.element}\`\` `)
      array1.push(`***Strength :*** \`\`${item.strength}\`\` \u200B \u200B ***Endurance :*** \`\`${item.endurance}\`\` \u200B \u200B  ***Vitality :*** \`\`${item.vitality}\`\`  `)
      array1.push(`***Leadership :*** \`\`${item.leadership}\`\` \u200B \u200B ***Intellect :*** \`\`${item.intellect}\`\` `)
      newEmbed.addField(`card info:`, array1)



newEmbed.setColor('#0099ff')
      newEmbed.setThumbnail(item.imgurl)
      message.reply(newEmbed)

    }


  })


  datawegot.save().then(resultadd => console.log("boom"))
  .catch(err => console.log(err));
})
return



}
var cardid = args[0]
var userid = message.author.id
console.log(userid);
console.log(cardid);
var array1 = []
await Report.findOne({userid: userid }).then(function(datawegot){

  datawegot.cardstats.forEach( (item,i) => {

    if(item.cardid === cardid){
      console.log("henlo");


      const newEmbed = new Discord.MessageEmbed().setTitle('Card information')
      let basescore
      if (item.cardtype === "Common"){
        basescore = 1
      }
      if (item.cardtype === "Uncommon"){
        basescore = 2
      }
      if (item.cardtype === "Rare"){
        basescore = 3
      }
      if (item.cardtype === "Epic"){
        basescore = 4
      }
      if (item.cardtype === "Legendary"){
        basescore = 5
      }

      array1.push(`***Cardname :*** \`\`${item.cardname}\`\` `)
      array1.push(`***Series :*** \`\`${item.series}\`\` `)
      array1.push(`***Cardtype :*** \`\`${item.cardtype}\`\` `)
        array1.push(`***Cardscore :*** \`\`${basescore}\`\` + \`\`${item.cardscore - basescore}\`\`  `)
        array1.push(`***Upgrades :*** \`\`${item.upgrade}\`\` `)
      array1.push(`***Element :*** \`\`${item.element}\`\` `)
      array1.push(`***Strength :*** \`\`${item.strength}\`\` \u200B \u200B ***Endurance :*** \`\`${item.endurance}\`\` \u200B \u200B  ***Vitality :*** \`\`${item.vitality}\`\`  `)
      array1.push(`***Leadership :*** \`\`${item.leadership}\`\` \u200B \u200B ***Intellect :*** \`\`${item.intellect}\`\` `)
      newEmbed.addField(`card info:`, array1)



newEmbed.setColor('#0099ff')
      newEmbed.setThumbnail(item.imgurl)
      message.reply(newEmbed)

    }


  })


  datawegot.save().then(resultadd => console.log("boom"))
  .catch(err => console.log(err));
})













};

exports.help = {
  name: 'view'
};
