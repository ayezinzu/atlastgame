const { Client, MessageAttachment } = require('discord.js');
exports.run = (client,message,args) => {

var interval = setInterval (function () {
  const randomcard = Math.floor(Math.random() * 4);
  const attachment1 = new MessageAttachment(`./card.png`);
    const attachment2 = new MessageAttachment(`./card${randomcard}.png`);
    attacharray = [attachment1, attachment2];
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
  // randomGuy = {
  //   winner : <@randomWinner>
  // }
  fighters.splice(randomNumber, 1)

const map1 = fighters.map(x => `<@${x}>`);
  message.channel.send(`<@${randomWinner}> fought off ${map1} and won the xyz card worth xyz points`, attachment2)


} }, 10000)
}, 100000);
  };

  exports.help = {
    name: 'lol'
  };
