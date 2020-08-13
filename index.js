

const Discord = require('discord.js');
const { Client, MessageAttachment } = require('discord.js');
const cooldowns = new Discord.Collection();
const fs = require('fs');
const Enmap = require('enmap');

const Report = require("./models/report.js")
const Addcard = require("./models/addcard.js")
const MongoClient = require('mongodb').MongoClient;
const Channel = require("./models/dropchannel.js")
const used = new Map();
const client = new Discord.Client();
require('dotenv-flow').config();
const mongoose = require("mongoose");
var chunk = require('lodash.chunk');
var _ = require('lodash');
const { random } = require('lodash');


const config = {
    token: process.env.TOKEN,
    // owner: process.env.OWNER,
    prefix: process.env.PREFIX
}; 

const prefix = config.prefix;


client.commands = new Enmap();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await client.user.setAvatar('avatar.png')
});

// [!!mute @User 12h Posting too many good memes]
// 0        1     2      3     5   6    7   8
// !!mute <user> <time> <reason> \
let msgss = 0

client.on('message', async message => {
  realMessage = message.content.toLowerCase()
  if (message.author.bot) return;

msgss++


console.log(msgss);
let finalChannels = []
const theChannel = await Channel.find();
theChannel.forEach((randomChannel, i) => {
  let val = randomChannel.channel.substr(2, 18);
finalChannels.push(val)
})
  console.log(finalChannels)
  finalChannels.forEach((exactChannel, i) => {

  
    setTimeout(() => {
      if(msgss < 20) return;
      
msgss = 0

        if (realMessage.indexOf(prefix) === 0) return;
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
          timeout : 15000,
          reason : "myhomemyrules"
        }



        
          const cardmsg = client.channels.fetch(exactChannel).then(channel => {return channel.send("*wooosh !* ***A card from Atlas Has spawned***",attachment1) })




                    .then(function (cardmsg) {

                      cardmsg.react("👍")

                      cardmsg.delete(gucci)


                      const filter = (reaction, user) => {
            return reaction.emoji.name === '👍';
          };

          const collector = cardmsg.createReactionCollector( filter, { min:3, time: 15000 });


          collector.on('collect', (reaction, user) => {
            console.log(`FIRST ${fighters}`)
            if(fighters.includes(user.id) === true && user.id !== `718029431205134348`) {
      
              return
            }
            console.log(`Collected ${reaction.emoji.name} from ${user.id}`);
            fighters.push(user.id);
            console.log(`LASTTT ${fighters}`);
            console.log(cardname);
            console.log(strength);
          });

          collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
          });



                    }).then(function (newmsg) {
                      client.channels.fetch(exactChannel).then(channel => {return channel.send('***The battle for the card begins in 15 seconds***') })
                      .then(x => {
                        setTimeout(() => {x.edit('***The battle was lethal, thank goodness no one was hurt! \n Here are the results :***')}, 15000)
                        // edits the message after 5s
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
          username = client.users.cache.get(randomWinner).username;
          usernameDiscrim = client.users.cache.get(randomWinner).discriminator;

        const map1 = fighters.map(x => `<@${x}>`);
        let noone
        if(map1.length === 0){
          noone = "no one"
        }
        if(map1.length > 0){
          noone = ""
        }
          
          client.channels.fetch(exactChannel).then(channel => {channel.send(`<@${randomWinner}> fought off ${map1}${noone} and won the ${cardname} \`\`${cardid}\`\` card worth +${cardscore}P`, attachment2) })
          
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
          client.channels.fetch(exactChannel).then(channel => {channel.send(`Oh no! The \`\`${cardname}\`\` worth \`\`${cardscore} Pts\`\` got away!`, attachment2) })
        } }, 16000)

    },1000)
})


console.log(realMessage.indexOf(prefix));
    if (realMessage.indexOf(prefix) !== 0) return;
    
    const args = realMessage.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    console.log(command);
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      }
    }
    else {
      timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    if (!cmd) return;

    cmd.run(client, message, args);



});

fs.readdir('./commands/', async (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
      if (!file.endsWith('.js')) return;
      let props = require(`./commands/${file}`);
      let cmdName = file.split('.')[0];
      console.log(`Loaded command '${cmdName}'`);
      client.commands.set(cmdName, props);
    });
  });

client.login(process.env.TOKEN);
