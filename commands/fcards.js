const Discord = require('discord.js');
const mongoose = require("mongoose");
const Addcard = require("../models/addcard.js")
const Report = require("../models/report.js")
var userid = ""
var username = ""
var fire = ""
var total = 1
var total1 = 1
var total2 = 1
var total3 = 1
var total4 = 1
var total5 = 1
var total6 = 1
var total7 = 1
var counts = {};
var totalpoints =0
stars = ""
var cardlist = []
var cardstats = []
exports.run = async (client, message, args) => {
  if (!args[0]) return;

  var userid = message.mentions.members.first().id
  var userimg = message.mentions.members.first()
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

      const item1 = `***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}**${item.cardtype}** - <:Dark:718420627119407130> - ${item.series}`
arrayit.push(item1)
    }
  });

  cardstats.forEach(async (item, i) => {

    if (item.element === "Light") {
      const item2 = `***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}**${item.cardtype}** - <:Light:718420676809326713> - ${item.series}`
arrayit.push(item2)
    }
  });
  cardstats.forEach(async (item, i) => {

    if (item.element === "Fire") {

      const item3 = `***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars} **${item.cardtype}** - <:Fire:719762224864034867> - ${item.series} `
arrayit.push(item3)
    }
  });
  cardstats.forEach(async (item, i) => {

    if (item.element === "Water") {
      const item4 = `***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars} **${item.cardtype}** - <:Water:718420691367755806> - ${item.series}`
arrayit.push(item4)
    }
  });
  cardstats.forEach(async (item, i) => {

    if (item.element === "Earth") {
      const item5 = `***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}  **${item.cardtype}** - <:Earth:718420647948189696> - ${item.series}`
arrayit.push(item5)
    }
  });
  cardstats.forEach(async (item, i) => {

    console.log(stars);
    console.log(item.cardscore);
    if (item.element === "Air") {
      const item6 = `***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars}  **${item.cardtype}** - <:Air:718420604063055963> - ${item.series}`
arrayit.push(item6)
    }
  });
  cardstats.forEach(async (item, i) => {

    if (item.element === "Dual") {
      const item7 = `***\`\`${item.cardid}\`\` - ${item.cardname}*** - ${stars} **${item.cardtype}** - <:Dual:719804427103633489> - ${item.series}`
arrayit.push(item7)
    }

  });







  exampleEmbed.addField(`Cards`, arrayit)




  exampleEmbed.setThumbnail(userimg.user.avatarURL())
  exampleEmbed.setColor('#0099ff')
  // exampleEmbed.setImage(userimg.avatarURL())


  message.channel.send(exampleEmbed);
  total = 1



};

exports.help = {
  name: 'fcards'
};
