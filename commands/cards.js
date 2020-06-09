const Discord = require('discord.js');
const mongoose = require("mongoose");
const Addcard = require("../models/addcard.js")
const Report = require("../models/report.js")
mongoose.connect('mongodb+srv://admin:admin@cluster0-hlj9n.mongodb.net/atlasdb?retryWrites=true&w=majority',{
  useNewUrlParser: true
}, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Database connection initiated");
  }
});
var userid = ""
var username = ""

var cardstats = []
exports.run = async (client,message,args) => {
  userid = message.author.id;
  await Report.findOne({userid: userid}).then( (result) => {
    username = result.username
    cardstats = result.cardstats
  } ).catch( (err) => console.log(err))





const exampleEmbed = new Discord.MessageEmbed().setTitle('Card collection');
exampleEmbed.setDescription(`Cards carried by <@${userid}>`)
cardstats.forEach((item, i) => {
  
  exampleEmbed.addField(`Card Name:`, `***${item.cardname}*** - ${item.element}`)
  exampleEmbed.addFields(
  { name: 'Card Type', value: `${item.cardtype}`, inline: true },
  { name: 'Card score', value: `${item.cardscore}`, inline: true },

)
exampleEmbed.addFields(
{ name: 'Strength', value: `${item.strength}`, inline: true },
{ name: 'Vitality', value: `${item.vitality}`, inline: true },
{ name: 'Endurance', value: `${item.endurance}`, inline: true },
{ name: 'Leadership', value: `${item.leadership}`, inline: true },
{ name: 'Intellect', value: `${item.intellect}`, inline: true },
)
.setImage('https://i.imgur.com/wSTFkRM.png')
});

exampleEmbed.setColor('#0099ff')


message.channel.send(exampleEmbed);


};

exports.help = {
  name: 'cards'
};
