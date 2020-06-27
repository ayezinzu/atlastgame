const Discord = require('discord.js');
const mongoose = require("mongoose");
const Addcard = require("../models/addcard.js")
const Report = require("../models/report.js")
var chunk = require('lodash.chunk');
var _ = require('lodash');
mongoose.connect('mongodb+srv://admin:admin@cluster0-hlj9n.mongodb.net/atlasdb?retryWrites=true&w=majority', {
  useNewUrlParser: true
}, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connection initiated");
  }
});
var userid = ""
var username = ""
var fire = ""
stars = ""
var totalpoints = 0


var cardstats = []
exports.run = async (client, message, args) => {


  if (args[0]) {
    var userid = message.mentions.members.first().id
    var userimg = message.mentions.members.first()
    result = await Report.exists({userid: userid})
    if (result === false){
      message.channel.send("no cards found.")
  return
    }
    userimg.user.avatarURL()
    console.log(userimg.user.avatarURL());

    // console.log(message.mentions.members.first());
    await Report.findOne({
      userid: userid
    }).then((result) => {
      username = result.username
      cardstats = result.cardstats
      dust = result.dust
    }).catch((err) => console.log(err))

    cardstats.forEach((item, i) => {
        totalpoints = totalpoints + item.cardscore
    });
    const exampleEmbed = new Discord.MessageEmbed().setTitle('Card collection');
    exampleEmbed.setDescription(`*Cards carried by <@${userid}> \u200B Total points = ${totalpoints} \u200B \u200B \u200B     Dust = ${dust}* `)
    var arrayit = []
    cardstats.forEach((item, i) => {




      if (item.element === "Dark") {

        const item1 = ` *** \`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}**${item.cardtype}** - <:Dark:718420627119407130> - ${item.series} \n `
    arrayit.push(item1)
      }
    });

    cardstats.forEach(async (item, i) => {

      if (item.element === "Light") {
        const item2 = `  *** \`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}**${item.cardtype}** - <:Light:718420676809326713> - ${item.series} \n `
    arrayit.push(item2)
      }
    });
    cardstats.forEach(async (item, i) => {

      if (item.element === "Fire") {

        const item3 = ` ***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars} **${item.cardtype}** - <:Fire:719762224864034867> - ${item.series} \n `
    arrayit.push(item3)
      }
    });
    cardstats.forEach(async (item, i) => {

      if (item.element === "Water") {
        const item4 = ` ***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars} **${item.cardtype}** - <:Water:718420691367755806> - ${item.series} \n `
    arrayit.push(item4)
      }
    });
    cardstats.forEach(async (item, i) => {

      if (item.element === "Earth") {
        const item5 = `  ***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}  **${item.cardtype}** - <:Earth:718420647948189696> - ${item.series} \n `
    arrayit.push(item5)
      }
    });
    cardstats.forEach(async (item, i) => {

      console.log(stars);
      console.log(item.cardscore);
      if (item.element === "Air") {
        const item6 = ` ***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}  **${item.cardtype}** - <:Air:718420604063055963> - ${item.series} \n`
    arrayit.push(item6)
      }
    });
    cardstats.forEach(async (item, i) => {

      if (item.element === "Dual") {
        const item7 = ` ***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars} **${item.cardtype}** - <:Dual:719804427103633489> - ${item.series} \n `
    arrayit.push(item7)
      }

    });







    exampleEmbed.addField(`Cards`, arrayit)




    exampleEmbed.setThumbnail(userimg.user.avatarURL())
    exampleEmbed.setColor('#0099ff')
    // exampleEmbed.setImage(userimg.avatarURL())

    raynum = Math.round(arrayit.length)

    arrayb = _.chunk(arrayit, 10)

    var itis = []
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
        .setTitle("Cards owned by them")
        .setDescription(`List of cards owned by <@${userid}>  | Total points = ${totalpoints} | Dust = ${dust}`)
        .setFooter("Use the reactions to navigate.")


totalpoints = 0;

return


  }

  userid = message.author.id;
  result = await Report.exists({userid: userid})
  if (result === false){
    message.channel.send("no cards found.")
return
  }



  // console.log(message.mentions.members.first());
  await Report.findOne({
    userid: userid
  }).then((result) => {
    username = result.username
    cardstats = result.cardstats
    dust = result.dust
  }).catch((err) => console.log(err))

  cardstats.forEach((item, i) => {
      totalpoints = totalpoints + item.cardscore
  });
  const exampleEmbed = new Discord.MessageEmbed().setTitle('Card collection');
  exampleEmbed.setDescription(`*Cards carried by <@${userid}> \u200B Total points = ${totalpoints} \u200B \u200B \u200B     Dust = ${dust}* `)
  var arrayit = []
  cardstats.forEach((item, i) => {




    if (item.element === "Dark") {

      const item1 = ` *** \`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}**${item.cardtype}** - <:Dark:718420627119407130> - ${item.series} \n `
  arrayit.push(item1)
    }
  });

  cardstats.forEach(async (item, i) => {

    if (item.element === "Light") {
      const item2 = `  *** \`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}**${item.cardtype}** - <:Light:718420676809326713> - ${item.series} \n `
  arrayit.push(item2)
    }
  });
  cardstats.forEach(async (item, i) => {

    if (item.element === "Fire") {

      const item3 = ` ***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars} **${item.cardtype}** - <:Fire:719762224864034867> - ${item.series} \n `
  arrayit.push(item3)
    }
  });
  cardstats.forEach(async (item, i) => {

    if (item.element === "Water") {
      const item4 = ` ***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars} **${item.cardtype}** - <:Water:718420691367755806> - ${item.series} \n `
  arrayit.push(item4)
    }
  });
  cardstats.forEach(async (item, i) => {

    if (item.element === "Earth") {
      const item5 = `  ***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}  **${item.cardtype}** - <:Earth:718420647948189696> - ${item.series} \n `
  arrayit.push(item5)
    }
  });
  cardstats.forEach(async (item, i) => {

    console.log(stars);
    console.log(item.cardscore);
    if (item.element === "Air") {
      const item6 = ` ***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}  **${item.cardtype}** - <:Air:718420604063055963> - ${item.series} \n`
  arrayit.push(item6)
    }
  });
  cardstats.forEach(async (item, i) => {

    if (item.element === "Dual") {
      const item7 = ` ***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars} **${item.cardtype}** - <:Dual:719804427103633489> - ${item.series} \n `
  arrayit.push(item7)
    }

  });













  exampleEmbed.setColor('#0099ff')
  // exampleEmbed.setImage(userimg.avatarURL())

  raynum = Math.round(arrayit.length)

  arrayb = _.chunk(arrayit, 10)

  var itis = []
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
    .setTitle(`Cards owned by <@${userid}>`)
    .setDescription("same but for the description")
    .setFooter("Use the reactions to navigate.")

    // Deploy embed
    FieldsEmbed.build();


    FieldsEmbed.embed
    .setColor(0x6F3FAA)
      .setTitle(`Cards owned`)
      .setDescription(`List of cards owned by <@${userid}>  | Total points = ${totalpoints} | Dust = ${dust}`)
      .setFooter("Use the reactions to navigate.")






























totalpoints = 0;

};

exports.help = {
  name: 'cards'
};
