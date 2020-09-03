// const Canvas = require("canvas");
// const Discord = require("discord.js");

// const mongoose = require("mongoose");
// const Addcard = require("../models/addcard.js");
// const Addboss = require("../models/addboss.js");
// const Report = require("../models/report.js");
// const Pagination = require("discord-paginationembed");
// let chunk = require("lodash.chunk");
// let _ = require("lodash");
// const Channel = require("../models/raidchannel.js")
// exports.run = async (client, message, args) => {
//     let cardsarray = [] // this will contain cards of the participants
//     let participants = [] // array of participants
//     class Input {
//         constructor(cardsarray, participants, bosscardname,bossdifficulty, bosselement, bossstrength, bossvitality, bossendurance, bossleadership, bossintellect, thistheguy, enteredname, enteredcardtype, enteredcardelement){
//           this.cardsarray = cardsarray;
//           this.participants = participants
//           this.bosscardname = bosscardname
//           this.bossdifficulty = bossdifficulty
//           this.bosselement = bosselement
//           this.bossstrength = bossstrength
//           this.bossvitality = bossvitality
//           this.bossendurance = bossendurance
//           this.bossleadership = bossleadership
//           this.bossintellect = bossintellect
//           this.thistheguy = thistheguy
//           this.enteredname = enteredname
//           this.enteredcardtype = enteredcardtype
//           this.enteredcardelement = enteredcardelement
//         }
         
//     }
      
//   const addbosscount = await Addboss.countDocuments().exec(); // counting boss cards

//   // Get a random entry
//   var random12 = Math.floor(Math.random() * addbosscount);
//   // Again query all users but only fetch one offset by our random #
//   const bosscard = await Addboss.findOne()
//     .skip(random12)
//     .exec(); // getting random boss cards
//     bossimg = new Discord.MessageAttachment(`${bosscard.imgurl}`);
//     let bosscardname = bosscard.cardname;
//     let bossdifficulty = bosscard.difficulty;
//     let bosselement = bosscard.element;
//     let bossstrength = parseInt(bosscard.strength);
//     let bossvitality = parseInt(bosscard.vitality);
//     let bossendurance = parseInt(bosscard.endurance);
//     let bossleadership = parseInt(bosscard.leadership);
//     let bossintellect = parseInt(bosscard.intellect);
//     // setting up vars
//     await message.channel.send(`\`\`A Raid Boss Has Spawned\`\``, bossimg);
//     await message.channel.send(
//       `\`\`${bosscard.cardname} (Level-${bosscard.difficulty}) - ${
//         bosscard.element
//       }\`\``
//     );
//     await message.channel.send(
//         `Enter \`\`CARDID\`\` to enter a card in the battle !`
//       );
//     await message.channel.send(`\n Battle Starts in 30 seconds!`);
//     const filter = m => m.content;
//     const collector = message.channel.createMessageCollector(filter, {
//     time: 30000
//   });
//   // sending initiative messages
//   collector.on("collect", async m => {
//     if (m.author.bot) return;
//     if(participants.includes(m.author.id)){
//       message.channel.send(`\`\`You have already sent a fighter into this battle!\`\``)
//       return
//     }
//     let poggers = 0
//     const thistheguy = await Report.findOne({
//         userid: m.author.id
//       });
//       for(i=0; i < thistheguy.cardstats.length; i++) {
//         const item = thistheguy.cardstats[i];
//         if(m.content === item.cardid){
//           participants.push(m.author.id)
//           let enteredname = item.cardname
//           let enteredcardtype = item.cardtype
//           let enteredcardelement = item.element
//           cardsarray.push({
//             cardid: m.content,
//             cardowner: m.author.id
//           });
//           message.channel.send(`<@${m.author.id}> entered \`\`${enteredname} (${enteredcardtype}) - (${enteredcardelement})\`\` into the battle !`)
//           poggers = 1
//           break
//         }
//         else {
//           poggers = 0 
//         }
//       }
//       if(poggers === 0){
//         message.channel.send(`Error : Card not found`)
//         }
// })
// collector.on("end", async collected => {
// let newInput = new Input()
// if(newInput.cardsarray.length < 1) {
//   message.channel.send("**Oh no! Looks like the boss has escaped before our heroes could get there!**")
//   return}
// })

// }
// exports.help = {
//   name: "boss"
// };