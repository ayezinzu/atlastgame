const mongoose = require("mongoose");
const Report = require("../models/report.js")
const Addcard = require("../models/addcard.js")
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0-hlj9n.mongodb.net/atlas?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});




const { Client, MessageAttachment } = require('discord.js');
exports.run = (bot, message, args) => {
  var cardname = ""
  var imgurl = ""
  var cardscore = ""
  var cardtype = ""
  var element = ""
  var strength = ""
  var vitality = ""
  var endurance = ""
  var leadership = ""
  var intellect = ""
  var attachment2 = ""
  var dust = ""
  const randomcard = Math.floor(Math.random() * 4);
  const attachment1 = new MessageAttachment(`./card.png`);


    Addcard.count().exec(function (err, count) {

      // Get a random entry
      var random123 = Math.floor(Math.random() * count)

      // Again query all users but only fetch one offset by our random #
      Addcard.findOne().skip(random123).exec(
        function (err, result) {
          // Tada! random user
           cardname = result.cardname;
           imgurl = result.imgurl;
           cardtype = result.cardtype;
           cardscore = result.cardscore;
           element = result.element;
           strength = result.strength;
           console.log(strength);
           vitality = result.vitality;
           endurance = result.endurance;
           leadership = result.leadership;
           intellect = result.intellect
           console.log(vitality);
           attachment2 = new MessageAttachment(`${result.imgurl}`);



        })
    })



const fighters = [];
var gucci = {
  timeout : 10000,
  reason : "myhomemyrules"
}




  const cardmsg = message.channel.send("*wooosh !* ***A card from Atlas Has spawned***",attachment1)




            .then(function (cardmsg) {

              cardmsg.react("👍")

              cardmsg.delete(gucci)


              const filter = (reaction, user) => {
  	return reaction.emoji.name === '👍';
  };

  const collector = cardmsg.createReactionCollector( filter, { min:3, time: 10000 });


  collector.on('collect', (reaction, user) => {
  	console.log(`Collected ${reaction.emoji.name} from ${user.id}`);
    fighters.push(user.id);
    console.log(fighters);
    console.log(cardname);
    console.log(strength);
  });

  collector.on('end', collected => {
  	console.log(`Collected ${collected.size} items`);
  });



            }).then(function (newmsg) {
              message.channel.send('***The battle for the card beginds in 10 seconds***').then(x => {
                setTimeout(() => {x.edit('***The battle was lethal, thank goodness no one was hurt! Here are the results :***')}, 5000)
                // edits the message after 5s
              }).then( () => {console.log(fighters.length);}).catch(function(err) {
              console.log(err);
             });
console.log(fighters.length);





});
setTimeout(() => { if(fighters.length > 2){

  randomNumber = Math.floor(Math.random()*fighters.length)
  randomWinner = fighters[randomNumber]

  fighters.splice(randomNumber, 1)
  winnerUsername = `<@${randomWinner}>`
  console.log(winnerUsername);
  username = bot.users.cache.get(randomWinner).username;
  usernameDiscrim = bot.users.cache.get(randomWinner).discriminator;

const map1 = fighters.map(x => `<@${x}>`);
  message.channel.send(`<@${randomWinner}> fought off ${map1} and won the ${cardname} card worth ${cardscore} points`, attachment2)
console.log(strength);
console.log(endurance);

Report.exists({userid: randomWinner}, function(err, resultok){
  if (err){
    console.log(err);
  }
  if(resultok === true){
    Report.findOne({userid: randomWinner}, function(err,docs) {


       Report.findOne({userid: randomWinner }).then(function(datawegot){
         datawegot.cardstats.push({cardname: cardname, cardtype: cardtype, cardscore: cardscore, element: element, strength: strength, endurance: endurance, vitality: vitality, leadership: leadership, intellect: intellect});
         datawegot.save().then(resultadd => console.log(resultadd))
         .catch(err => console.log(err));
       })

   } )

  }
  if(resultok === false){
    const report = new Report({

      username: `${username}#${usernameDiscrim}`,
      userid: randomWinner,
      dust: "",
      cardstats: [{cardname: cardname, cardtype: cardtype, cardscore: cardscore, element: element, strength: strength, endurance: endurance, vitality: vitality, leadership: leadership, intellect: intellect}]
    });
    report.save()
    .then(resultk => console.log(resultk))
    .catch(err => console.log(err));
  }

})







} }, 10000)



}

exports.help = {
  name: 'ping'
};
// then((sentMessage) =>
// sentMessage.edit("Boop!"))
