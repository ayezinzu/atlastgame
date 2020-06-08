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

var cardname = ""
var cardtype = ""
var cardscore = ""
var imgurl = ""
var element = ""
var strength = ""
var vitality = ""
var endurance = ""
var leadership = ""
var intellect = ""

exports.run = (client,message,args) => {
  var gucci = {
    timeout : 10000,
    reason : "myhomemyrules"
  }
const filter = m => m.author.id === message.author.id;
 message.reply("Please enter card name..this message will expire in 20 seconds").then( r => r.delete(gucci))
message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {
   cardname = collected.first().content;

  message.channel.send("thank you")

}).then( async imgmsg => {
  message.reply("Ok now post the card img url (right click on card img on discord, copy link and paste here)")

  await message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {
    imgurl = collected.first().content;

  message.channel.send("thank you")

}) })
.then( async elementmsg => {
  message.reply("element name ?")

  await message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {
    element = collected.first().content;

  message.channel.send("thank you")

}) })
.then( async strengthmsg => {
  message.reply("Enter strength")

  await message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {
    strength = collected.first().content;

  message.channel.send("thank you")

}) })
.then( async vitalitymsg => {
  message.reply("Enter vitality")

  await message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {
    vitality = collected.first().content;

  message.channel.send("thank you")

}) })
.then( async endurancemsg => {
  message.reply("Enter endurance")

  await message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {
    endurance = collected.first().content;

  message.channel.send("thank you")

}) })
.then( async leadershipmsg => {
  message.reply("leadership")

  await message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {
    leadership = collected.first().content;

  message.channel.send("thank you")

}) })
.then( async intellectmsg => {
  message.reply("Enter intellect")

  await message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {
    intellect = collected.first().content;

  message.channel.send("thank you")

}) })

.then( async secondmsg => {
  message.reply("Amazing, now enter the card type ")

  await message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {
   cardtype = collected.first().content;
  console.log(cardtype);

  message.channel.send("thank you")

}) })
.then( async thirdmsg => {
  message.reply("hmm, now enter the card score")

  await message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {
   cardscore = collected.first().content;
  console.log(cardscore);

  message.channel.send("aight chief, the card has been added to our stack :)")
  const addcard = new Addcard({
    _id: mongoose.Types.ObjectId(),
    cardname: cardname,
    cardtype: cardtype,
    cardscore: cardscore,
    imgurl: imgurl,
    strength: strength,
    leadership: leadership,
    element: element,
    vitality: vitality,
    endurance: endurance,
    intellect: intellect




  });
  addcard.save()
  .then(result => console.log(result))
  .catch(err => console.log(err));

}) })






.catch(err => console.log(err))




};

exports.help = {
  name: 'add'
};
