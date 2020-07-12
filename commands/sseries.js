const Discord = require('discord.js');
const mongoose = require("mongoose");
const Addcard = require("../models/addcard.js")
const Report = require("../models/report.js")
var chunk = require('lodash.chunk');
var _ = require('lodash');
let okEmbed

exports.run = async (client,message,args) => {
  let newargs = args.join(" ")
  const filter = m => m.author.id === message.author.id;
var array = []
  okEmbed = new Discord.MessageEmbed().setTitle('Cards');
  okEmbed.setDescription(`Showing cards related to ${newargs}`)
  okEmbed.setColor('#0099ff')




  await Addcard.find({ "series" : { $regex: newargs, $options: 'i' }} , function (err, docs) {
    if(err) console.log(err);
    if(docs) {

      docs.forEach((item, i) => {

  array.push(`***${i+1}.  \`\`${item.series}\`\` - ${item.cardname} \n*** `)








      });

      }
    raynum = Math.round(array.length)
    console.log(array);
    console.log(raynum);
    arrayb = _.chunk(array, 10)



  })

let itis = []
console.log(arrayb);
const idk = arrayb.forEach((item, i) => {
console.log(item);
   itis.push({
     word: `\n \n ,${item}`
   })
});
 console.log(itis);

    const Pagination = require('discord-paginationembed');
    const FieldsEmbed = new Pagination.FieldsEmbed()
  // A must: an array to paginate, can be an array of any type
  .setArray(itis)
  // Set users who can only interact with the instance, set as `[]` if everyone can interact.
  .setAuthorizedUsers([message.author.id])
   // A must: sets the channel where to send the embed
  .setChannel(message.channel)
  // Elements to show per page. Default: 10 elements per page
  .setElementsPerPage(1)
   // Have a page indicator (shown on message content)
  .setPageIndicator(true)
   // Format based on the array, in this case we're formatting the page based on each object's `word` property
  .formatField(' ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎', el => el.word)

  // Customise embed
  FieldsEmbed.embed
  .setColor(0x6F3FAA)
  .setTitle("a title for each pages (will stay on all the pages)")
  .setDescription("same but for the description")
  .setFooter("same but for ther footer")

  // Deploy embed
  FieldsEmbed.build();


  FieldsEmbed.embed
  .setColor(0x6F3FAA)
    .setTitle("Searching cards related to that series..")
    .setDescription(`Cards related to the series ${newargs}`)
    .setFooter("Use the reactions to navigate.")





  let array1 = []
  await message.channel.awaitMessages(filter, {max: 1, time: 10000}).then(async collected => {
    number = collected.first().content;
if(number === "stop"){
  message.channel.send("Query stopped. You can now search for another series.")
  return;
}
    await Addcard.find({ "series" : { $regex: newargs, $options: 'i' }} , function (err, docs) {
      if(err) {
        
        message.channel.send("```SERIES NOT FOUND```")
        
        console.log(err);
      return
      }
      if(docs) {

   

          const nextEmbed = new Discord.MessageEmbed().setTitle('Card information')

          array1.push(`***Cardname :*** \`\`${docs[number-1].cardname}\`\` `)
          array1.push(`***Series :*** \`\`${docs[number-1].series}\`\` `)
          array1.push(`***Cardtype :*** \`\`${docs[number-1].cardtype}\`\` `)
          array1.push(`***Cardscore :*** \`\`${docs[number-1].cardscore}\`\` `)
          array1.push(`***Element :*** \`\`${docs[number-1].element}\`\` `)
          array1.push(`***Strength :*** \`\`${docs[number-1].strength}\`\` \u200B \u200B ***Endurance :*** \`\`${docs[number-1].endurance}\`\` \u200B \u200B  ***Vitality :*** \`\`${docs[number-1].vitality}\`\`  `)
          array1.push(`***Leadership :*** \`\`${docs[number-1].leadership}\`\` \u200B \u200B ***Intellect :*** \`\`${docs[number-1].intellect}\`\` `)
          nextEmbed.addField(`cards:`, array1)



  nextEmbed.setColor('#0099ff')
          nextEmbed.setThumbnail(docs[number-1].imgurl)
          message.reply(nextEmbed)





      }

    });







  }).catch(err => console.log(err))

newargs = ""
itis = []

}
exports.help = {
  name: 'sname'
};
