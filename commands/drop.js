const mongoose = require("mongoose");
const Report = require("../models/report.js")
const Addcard = require("../models/addcard.js")
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0-hlj9n.mongodb.net/atlas?retryWrites=true&w=majority";
const used = new Map();
const Duration = require(`humanize-duration`)
const talkedRecently = new Set();

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});




const { Client, MessageAttachment } = require('discord.js');
exports.run = (bot, message, args) => {

  if (talkedRecently.has(message.author.id)) {
          message.channel.send("Please wait 45 mins before trying this again " + `<@${message.author.id}>`);
  } else {

         // the user can type the command ... your command code goes here :)

      // Adds the user to the set so that they can't talk for a minute


const cooldown = used.get(message.author.id);
if(cooldown) {
  const remaining = Duration(cooldown -Date.now(), { units: [`h`, `m`], round: true});
  return message.reply(`you need to wait ${remaining} before using this command!`).catch(err => console.log(err))
} else {

  used.set(message.author.id, Date.now() + 10000);
  setTimeout(() => used.delete(message.author.id), 10000)
}

  var cardname = ""
  var imgurl = ""
  var cardscore = ""
  var cardtype = ""
  var element = ""
  var strength = 0
  var vitality = 0
  var endurance = 0
  var leadership = 0
  var intellect = 0
  var attachment2 = ""
  var upgrade = 0
  var dust = 0
  var series = ""
  var cardid = Math.random().toString(20).substr(2, 6)
  console.log(cardid);
  var randomcard = Math.floor(Math.random() * 4);
  const attachment1 = new MessageAttachment(`./card.png`);


    Addcard.count().exec(function (err, count) {

      // Get a random entry
      var random123 = Math.floor(Math.random() * count)

      // Again query all users but only fetch one offset by our random #
      Addcard.findOne().skip(random123).exec(
        function (err, result) {
          // Tada! random user
          console.log(result);
           cardname = result.cardname;
           imgurl = result.imgurl;
           cardtype = result.cardtype;
           cardscore = result.cardscore;
           element = result.element;
           console.log(`THIS IS THE ELEMENT ${result.element} THIS IS THE REAL ${element}`);
           strength = result.strength;
           console.log(strength);
           vitality = result.vitality;
           endurance = result.endurance;
           leadership = result.leadership;
           intellect = result.intellect;
           series = result.series;
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
              message.channel.send('***The battle for the card begins in 10 seconds***').then(x => {
                if(fighters.length < 1) {
                  message.delete(gucci)
                  return
                }
                setTimeout(() => {x.edit('***The battle was lethal, thank goodness no one was hurt! \n Here are the results :***')}, 5000)
                // edits the message after 5s
                if(fighters.length < 1) {
                  message.delete(gucci)
                  console.log("hello");
                  return
                }
                
              }).then( () => {console.log(fighters.length);}).catch(function(err) {
              console.log(err);
             });
console.log(fighters.length);





});
setTimeout(() => { if(fighters.length > 2){
fighters.shift()
fighters.shift()
  randomNumber = Math.floor(Math.random()*fighters.length)

  randomWinner = fighters[randomNumber]


  fighters.splice(randomNumber, 1)
  winnerUsername = `<@${randomWinner}>`
  console.log(winnerUsername);
  username = bot.users.cache.get(randomWinner).username;
  usernameDiscrim = bot.users.cache.get(randomWinner).discriminator;

const map1 = fighters.map(x => `<@${x}>`);
let noone
if(map1.length === 0){
  noone = "no one"
}
if(map1.length > 0){
  noone = ""
}
  message.channel.send(`<@${randomWinner}> fought off ${map1}${noone} and won the ${cardname} \`\`${cardid}\`\` card worth +${cardscore}P`, attachment2)
console.log(strength);
console.log(endurance);

Report.exists({userid: randomWinner}, function(err, resultok){
  if (err){
    console.log(err);
  }
  if(resultok === true){
    Report.findOne({userid: randomWinner}, function(err,docs) {


       Report.findOne({userid: randomWinner }).then(function(datawegot){
         datawegot.cardstats.push({upgrade: upgrade,cardid: cardid ,cardname: cardname, cardtype: cardtype, cardscore: cardscore, element: element, strength: strength, endurance: endurance, vitality: vitality, leadership: leadership, intellect: intellect, series: series, imgurl: imgurl});
         datawegot.save().then(resultadd => console.log(resultadd))
         .catch(err => console.log(err));
       })

   } )

  }
  if(resultok === false){
    const report = new Report({

      username: `${username}#${usernameDiscrim}`,
      userid: randomWinner,
      dust: 0,
      cardstats: [{upgrade: upgrade, cardid: cardid,cardname: cardname, cardtype: cardtype, cardscore: cardscore, element: element, strength: strength, endurance: endurance, vitality: vitality, leadership: leadership, intellect: intellect, series: series, imgurl: imgurl}]
    });
    report.save()
    .then(resultk => console.log(resultk))
    .catch(err => console.log(err));
    console.log(element);
  }

})




randomcard = Math.floor(Math.random() * 4);


} else {
  message.channel.send(`Oh no! The \`\`${cardname}\`\` worth \`\`${cardscore} Pts\`\` got away!`, attachment2)
} }, 10000)


talkedRecently.add(message.author.id);
setTimeout(() => {
  // Removes the user from the set after a minute
  talkedRecently.delete(message.author.id);
}, 2700000);
}
}

exports.help = {
  name: 'drop'
};
// then((sentMessage) =>
// sentMessage.edit("Boop!"))
