const Canvas = require("canvas");
const Discord = require("discord.js");

const mongoose = require("mongoose");
const Addcard = require("../models/addcard.js");
const Addboss = require("../models/addboss.js");
const Report = require("../models/report.js");
const Pagination = require("discord-paginationembed");
var chunk = require("lodash.chunk");
var _ = require("lodash");
exports.run = async (client, message, args) => {
  var cardsarray = [];

  // GETTING A RANDOM BOSS -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const addbosscount = await Addboss.countDocuments().exec();

  // Get a random entry
  var random12 = Math.floor(Math.random() * addbosscount);
  // Again query all users but only fetch one offset by our random #
  const bosscard = await Addboss.findOne()
    .skip(random12)
    .exec();
console.log(random12);
  // SENDING BOSS MESSAGE -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  bossimg = new Discord.MessageAttachment(`${bosscard.imgurl}`);
  var bossdifficulty = bosscard.difficulty;
  var bosselement = bosscard.element;
  var bossstrength = parseInt(bosscard.strength);
  var bossvitality = parseInt(bosscard.vitality);
  var bossendurance = parseInt(bosscard.endurance);
  var bossleadership = parseInt(bosscard.leadership);
  var bossintellect = parseInt(bosscard.intellect);

  await message.channel.send(`\`\`A Raid Boss Has Spawned\`\``, bossimg);
  await message.channel.send(
    `\`\`${bosscard.cardname} (Level-${bosscard.difficulty}) - ${
      bosscard.element
    }\`\``
  );
  await message.channel.send(
    `Enter \`\`CARDID\`\` to enter a card in the battle !`
  );
  await message.channel.send(`\n Battle Starts in 30 seconds!`);
  const filter = m => m.content;
  const collector = message.channel.createMessageCollector(filter, {
    time: 10000
  });

  collector.on("collect", async m => {
    if (m.author.bot) return;
   

    console.log(`Collected ${m.content} ${m.author.id}`);
    let poggers = 0
    const thistheguy = await Report.findOne({
      userid: m.author.id
    });
    
    for(i=0; i < thistheguy.cardstats.length; i++) {
      const item = thistheguy.cardstats[i];
      if(m.content === item.cardid){
        var enteredname = item.cardname
        var enteredcardtype = item.cardtype
        var enteredcardelement = item.element
        cardsarray.push({
          cardid: m.content,
          cardowner: m.author.id
        });
        message.channel.send(`<@${m.author.id}> entered \`\`${enteredname} (${enteredcardtype}) - (${enteredcardelement})\`\` into the battle !`)
        poggers = 1
        break
      }
      else {
        poggers = 0 
      }
    }
    console.log(`RETUUUUUUUUUUUUURN ${poggers}`)
    if(poggers === 0){
      message.channel.send(`Error : Card not found`)
      
    }


  });

  collector.on("end", async collected => {
    console.log(`Collected ${collected.size}`);
    console.log(cardsarray[0]);
    if(cardsarray.length < 1) {
      message.channel.send("**Oh no! Looks like the boss has escaped before our heroes could get there!**")
      return}

      setTimeout(() => {
        message.channel.send(`**Battle commenced !**`)
      }, 2000);
      ;
    // FINDING THE USER WITH THE CARD ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    let totalstrength = 0;
    var totalvitality = 0;
    var totalendurance = 0;
    var totalleadership = 0;
    var totalintellect = 0;
    var elementarray = [];
    var cardnamearray = [];
    var cardtypearray = [];
    var cardelementarray = [];

    for (let itemone of cardsarray) {
      const thisisthecard = itemone.cardid;
      console.log(`THIS IS THE CARDID ${thisisthecard}`);
      const thisistheguy = await Report.findOne({
        userid: itemone.cardowner
      });

      thisistheguy.cardstats.forEach(async (item, i) => {
        console.log(`THIS IS THE ITEM ${item}`);
        if (item.cardid === thisisthecard) {
          cardnamearray.push(item.cardname);
          cardtypearray.push(item.cardtype);
          cardelementarray.push(item.element);
          totalstrength = totalstrength + parseInt(item.strength);
          totalvitality = totalvitality + parseInt(item.vitality);
          totalendurance = totalendurance + parseInt(item.endurance);
          totalleadership = totalleadership + parseInt(item.leadership);
          totalintellect = totalintellect + parseInt(item.intellect);
          elementarray.push(item.element);
        }
      });
    }

    if (
      totalstrength <= bossstrength &&
      totalvitality <= bossvitality &&
      totalendurance <= bossendurance &&
      totalleadership <= bossleadership &&
      totalintellect <= bossintellect
    ) {
      console.log(`We in baby`);
      // IF THE PLAYERS MEET THE BOSS STATS ---------------------------------------------------------------------------------------------------------------------------------------------------------
      let lightn = 0;
      let darkn = 0;
      let earthn = 0;
      let watern = 0;
      let firen = 0;
      let airn = 0;
      let dualn = 0;
      var winchance = 80;

      elementarray.forEach(x => x == "Light" && lightn++);
      elementarray.forEach(x => x == "Dark" && darkn++);
      elementarray.forEach(x => x == "Earth" && earthn++);
      elementarray.forEach(x => x == "Water" && watern++);
      elementarray.forEach(x => x == "Fire" && firen++);
      elementarray.forEach(x => x == "Air" && airn++);
      elementarray.forEach(x => x == "Dual" && dualn++);

      if (bosselement === "Water") {
        winchance = winchance + airn * 5;
      }
      if (bosselement === "Fire") {
        winchance = winchance + watern * 5;
      }
      if (bosselement === "Earth") {
        winchance = winchance + firen * 5;
      }
      if (bosselement === "Air") {
        winchance = winchance + earthn * 5;
      }

      console.log(`THIS IS THE FINAL WIN CHANCE ${winchance}`);
      var num = Math.random() * 100;
      const resultEmbed = new Discord.MessageEmbed().setTitle('Boss fight results');
        console.log(`not much winchance ${winchance}`);
        var randomcard =
          cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
        var randomcard1 =
          cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
              var slursarry = [
                          `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                          `\`\`${randomcard}\`\` is leading the battle!`,
                          `\`\`${randomcard}\`\` isn't giving up!`,
                          `\`\`${bosscardname}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                          `The raid party is working well together!`,
                          `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                          `\`\`${bosscardname}\`\` prepares an attack! Look out!`,
                          `\`\`${bosscardname}\`\` is defending!`,
                          `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                          `\`\`${randomcard}\`\` missed their attack!`,
                          `\`\`${randomcard}\`\` is defending!`,
                          `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                          `\`\`${bosscardname}\`\` is changing position!`,
                          `\`\`${randomcard}\`\` strikes!`,
                          `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                          `\`\`${bosscardname}\`\` stands their ground.`,
   			  `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                          `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                          `A glancing blow \`\`${randomcard}\`\`!`,
			  `Need some help? \`\`${randomcard}\`\` is here!`
                          `\`\`${randomcard}\`\` is eager to get this over with.`,
                          `Oh no! \`\`${bosscardname}\`\` is powering up!`,
                          `Never gonna give \`\`${randomcard}\`\` up!`,
                          `\`\`${randomcard}\`\` is giving it all they got!`,
                          `\`\`${randomcard}\`\` takes guard against \`\`${bosscardname}\`\``,
                          `\`\`${randomcard}\`\` attempts to lead the next attack!`,
			  `Who needs a plan when you got \`\`${randomcard}\`\` ?!`,
                          `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
                        ];

        console.log(cardnamearray);
        setTimeout(() => {
          console.log(Math.floor(Math.random() * cardnamearray.length));
          randomcard =
            cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
          randomcard1 =
            cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
            var slursarry = [
              `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
              `\`\`${randomcard}\`\` is leading the battle!`,
              `\`\`${randomcard}\`\` isn't giving up!`,
              `\`\`${bosscardname}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
              `The raid party is working well together!`,
              `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
              `\`\`${bosscardname}\`\` prepares an attack! Look out!`,
              `\`\`${bosscardname}\`\` is defending!`,
              `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
              `\`\`${randomcard}\`\` missed their attack!`,
              `\`\`${randomcard}\`\` is defending!`,
              `That attack landed \`\`${randomcard}\`\`! Nice one!`,
              `\`\`${bosscardname}\`\` is changing position!`,
              `\`\`${randomcard}\`\` strikes!`,
              `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
              `\`\`${bosscardname}\`\` stands their ground.`,
`\`\`${randomcard}\`\` made a mistake. Sorry!`,
              `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
              `A glancing blow \`\`${randomcard}\`\`!`,
`Need some help? \`\`${randomcard}\`\` is here!`
              `\`\`${randomcard}\`\` is eager to get this over with.`,
              `Oh no! \`\`${bosscardname}\`\` is powering up!`,
              `Never gonna give \`\`${randomcard}\`\` up!`,
              `\`\`${randomcard}\`\` is giving it all they got!`,
              `\`\`${randomcard}\`\` takes guard against \`\`${bosscardname}\`\``,
              `\`\`${randomcard}\`\` attempts to lead the next attack!`,
`Who needs a plan when you got \`\`${randomcard}\`\` ?!`,
              `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
            ];
          randomslur1 = slursarry[Math.floor(Math.random() * slursarry.length)];
          message.channel.send(randomslur1);
          setTimeout(() => {
            console.log(Math.floor(Math.random() * cardnamearray.length));

            randomcard =
              cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
            randomcard1 =
              cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
              var slursarry = [
                `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                `\`\`${randomcard}\`\` is leading the battle!`,
                `\`\`${randomcard}\`\` isn't giving up!`,
                `\`\`${bosscardname}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                `The raid party is working well together!`,
                `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                `\`\`${bosscardname}\`\` prepares an attack! Look out!`,
                `\`\`${bosscardname}\`\` is defending!`,
                `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                `\`\`${randomcard}\`\` missed their attack!`,
                `\`\`${randomcard}\`\` is defending!`,
                `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                `\`\`${bosscardname}\`\` is changing position!`,
                `\`\`${randomcard}\`\` strikes!`,
                `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                `\`\`${bosscardname}\`\` stands their ground.`,
 `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                `A glancing blow \`\`${randomcard}\`\`!`,
`Need some help? \`\`${randomcard}\`\` is here!`
                `\`\`${randomcard}\`\` is eager to get this over with.`,
                `Oh no! \`\`${bosscardname}\`\` is powering up!`,
                `Never gonna give \`\`${randomcard}\`\` up!`,
                `\`\`${randomcard}\`\` is giving it all they got!`,
                `\`\`${randomcard}\`\` takes guard against \`\`${bosscardname}\`\``,
                `\`\`${randomcard}\`\` attempts to lead the next attack!`,
`Who needs a plan when you got \`\`${randomcard}\`\` ?!`,
                `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
              ];
            randomslur2 = slursarry[Math.floor(Math.random() * slursarry.length)];
            message.channel.send(randomslur2);
            setTimeout(() => {
              console.log(Math.floor(Math.random() * cardnamearray.length));
              randomcard =
                cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
              randomcard1 =
                cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
                var slursarry = [
                  `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                  `\`\`${randomcard}\`\` is leading the battle!`,
                  `\`\`${randomcard}\`\` isn't giving up!`,
                  `\`\`${bosscardname}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                  `The raid party is working well together!`,
                  `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                  `\`\`${bosscardname}\`\` prepares an attack! Look out!`,
                  `\`\`${bosscardname}\`\` is defending!`,
                  `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                  `\`\`${randomcard}\`\` missed their attack!`,
                  `\`\`${randomcard}\`\` is defending!`,
                  `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                  `\`\`${bosscardname}\`\` is changing position!`,
                  `\`\`${randomcard}\`\` strikes!`,
                  `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                  `\`\`${bosscardname}\`\` stands their ground.`,
   `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                  `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                  `A glancing blow \`\`${randomcard}\`\`!`,
`Need some help? \`\`${randomcard}\`\` is here!`
                  `\`\`${randomcard}\`\` is eager to get this over with.`,
                  `Oh no! \`\`${bosscardname}\`\` is powering up!`,
                  `Never gonna give \`\`${randomcard}\`\` up!`,
                  `\`\`${randomcard}\`\` is giving it all they got!`,
                  `\`\`${randomcard}\`\` takes guard against \`\`${bosscardname}\`\``,
                  `\`\`${randomcard}\`\` attempts to lead the next attack!`,
`Who needs a plan when you got \`\`${randomcard}\`\` ?!`,
                  `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
                ];
              randomslur3 = slursarry[Math.floor(Math.random() * slursarry.length)];
              message.channel.send(randomslur3);
              setTimeout(() => {
                console.log(Math.floor(Math.random() * cardnamearray.length));
                randomcard =
                  cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
                randomcard1 =
                  cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
                  var slursarry = [
                    `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                    `\`\`${randomcard}\`\` is leading the battle!`,
                    `\`\`${randomcard}\`\` isn't giving up!`,
                    `\`\`${bosscardname}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                    `The raid party is working well together!`,
                    `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                    `\`\`${bosscardname}\`\` prepares an attack! Look out!`,
                    `\`\`${bosscardname}\`\` is defending!`,
                    `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                    `\`\`${randomcard}\`\` missed their attack!`,
                    `\`\`${randomcard}\`\` is defending!`,
                    `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                    `\`\`${bosscardname}\`\` is changing position!`,
                    `\`\`${randomcard}\`\` strikes!`,
                    `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                    `\`\`${bosscardname}\`\` stands their ground.`,
     `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                    `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                    `A glancing blow \`\`${randomcard}\`\`!`,
  `Need some help? \`\`${randomcard}\`\` is here!`
                    `\`\`${randomcard}\`\` is eager to get this over with.`,
                    `Oh no! \`\`${bosscardname}\`\` is powering up!`,
                    `Never gonna give \`\`${randomcard}\`\` up!`,
                    `\`\`${randomcard}\`\` is giving it all they got!`,
                    `\`\`${randomcard}\`\` takes guard against \`\`${bosscardname}\`\``,
                    `\`\`${randomcard}\`\` attempts to lead the next attack!`,
  `Who needs a plan when you got \`\`${randomcard}\`\` ?!`,
                    `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
                  ];
                randomslur4 =
                  slursarry[Math.floor(Math.random() * slursarry.length)];
                message.channel.send(randomslur4);
                setTimeout(() => {
                  console.log(Math.floor(Math.random() * cardnamearray.length));
                  randomcard =
                    cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
                  randomcard1 =
                    cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
                    var slursarry = [
                      `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                      `\`\`${randomcard}\`\` is leading the battle!`,
                      `\`\`${randomcard}\`\` isn't giving up!`,
                      `\`\`${bosscardname}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                      `The raid party is working well together!`,
                      `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                      `\`\`${bosscardname}\`\` prepares an attack! Look out!`,
                      `\`\`${bosscardname}\`\` is defending!`,
                      `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                      `\`\`${randomcard}\`\` missed their attack!`,
                      `\`\`${randomcard}\`\` is defending!`,
                      `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                      `\`\`${bosscardname}\`\` is changing position!`,
                      `\`\`${randomcard}\`\` strikes!`,
                      `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                      `\`\`${bosscardname}\`\` stands their ground.`,
       `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                      `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                      `A glancing blow \`\`${randomcard}\`\`!`,
    `Need some help? \`\`${randomcard}\`\` is here!`
                      `\`\`${randomcard}\`\` is eager to get this over with.`,
                      `Oh no! \`\`${bosscardname}\`\` is powering up!`,
                      `Never gonna give \`\`${randomcard}\`\` up!`,
                      `\`\`${randomcard}\`\` is giving it all they got!`,
                      `\`\`${randomcard}\`\` takes guard against \`\`${bosscardname}\`\``,
                      `\`\`${randomcard}\`\` attempts to lead the next attack!`,
    `Who needs a plan when you got \`\`${randomcard}\`\` ?!`,
                      `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
                    ];
                  randomslur5 =
                    slursarry[Math.floor(Math.random() * slursarry.length)];
                  message.channel.send(randomslur5);
                  setTimeout(() => {
                    console.log(Math.floor(Math.random() * cardnamearray.length));
                    randomcard =
                      cardnamearray[
                        Math.floor(Math.random() * cardnamearray.length)
                      ];
                    randomcard1 =
                      cardnamearray[
                        Math.floor(Math.random() * cardnamearray.length)
                      ];
                      var slursarry = [
                        `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                        `\`\`${randomcard}\`\` is leading the battle!`,
                        `\`\`${randomcard}\`\` isn't giving up!`,
                        `\`\`${bosscardname}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                        `The raid party is working well together!`,
                        `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                        `\`\`${bosscardname}\`\` prepares an attack! Look out!`,
                        `\`\`${bosscardname}\`\` is defending!`,
                        `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                        `\`\`${randomcard}\`\` missed their attack!`,
                        `\`\`${randomcard}\`\` is defending!`,
                        `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                        `\`\`${bosscardname}\`\` is changing position!`,
                        `\`\`${randomcard}\`\` strikes!`,
                        `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                        `\`\`${bosscardname}\`\` stands their ground.`,
         `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                        `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                        `A glancing blow \`\`${randomcard}\`\`!`,
      `Need some help? \`\`${randomcard}\`\` is here!`
                        `\`\`${randomcard}\`\` is eager to get this over with.`,
                        `Oh no! \`\`${bosscardname}\`\` is powering up!`,
                        `Never gonna give \`\`${randomcard}\`\` up!`,
                        `\`\`${randomcard}\`\` is giving it all they got!`,
                        `\`\`${randomcard}\`\` takes guard against \`\`${bosscardname}\`\``,
                        `\`\`${randomcard}\`\` attempts to lead the next attack!`,
      `Who needs a plan when you got \`\`${randomcard}\`\` ?!`,
                        `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
                      ];
                    randomslur6 =
                      slursarry[Math.floor(Math.random() * slursarry.length)];
                    message.channel.send(randomslur6);
                    setTimeout(() => {
                      console.log(Math.floor(Math.random() * cardnamearray.length));
                      randomcard =
                        cardnamearray[
                          Math.floor(Math.random() * cardnamearray.length)
                        ];
                      randomcard1 =
                        cardnamearray[
                          Math.floor(Math.random() * cardnamearray.length)
                        ];
                        var slursarry = [
                          `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                          `\`\`${randomcard}\`\` is leading the battle!`,
                          `\`\`${randomcard}\`\` isn't giving up!`,
                          `\`\`${bosscardname}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                          `The raid party is working well together!`,
                          `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                          `\`\`${bosscardname}\`\` prepares an attack! Look out!`,
                          `\`\`${bosscardname}\`\` is defending!`,
                          `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                          `\`\`${randomcard}\`\` missed their attack!`,
                          `\`\`${randomcard}\`\` is defending!`,
                          `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                          `\`\`${bosscardname}\`\` is changing position!`,
                          `\`\`${randomcard}\`\` strikes!`,
                          `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                          `\`\`${bosscardname}\`\` stands their ground.`,
   			  `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                          `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                          `A glancing blow \`\`${randomcard}\`\`!`,
			  `Need some help? \`\`${randomcard}\`\` is here!`
                          `\`\`${randomcard}\`\` is eager to get this over with.`,
                          `Oh no! \`\`${bosscardname}\`\` is powering up!`,
                          `Never gonna give \`\`${randomcard}\`\` up!`,
                          `\`\`${randomcard}\`\` is giving it all they got!`,
                          `\`\`${randomcard}\`\` takes guard against \`\`${bosscardname}\`\``,
                          `\`\`${randomcard}\`\` attempts to lead the next attack!`,
			  `Who needs a plan when you got \`\`${randomcard}\`\` ?!`,
                          `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
                        ];
                      randomslur7 =
                        slursarry[Math.floor(Math.random() * slursarry.length)];
                      message.channel.send(randomslur7);
                      setTimeout(() => {
                        console.log(
                          Math.floor(Math.random() * cardnamearray.length)
                        );
                        randomcard =
                          cardnamearray[
                            Math.floor(Math.random() * cardnamearray.length)
                          ];
                        randomcard1 =
                          cardnamearray[
                            Math.floor(Math.random() * cardnamearray.length)
                          ];
                          var slursarry = [
                            `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                            `\`\`${randomcard}\`\` is leading the battle!`,
                            `\`\`${randomcard}\`\` isn't giving up!`,
                            `\`\`${bosscardname}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                            `The raid party is working well together!`,
                            `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                            `\`\`${bosscardname}\`\` prepares an attack! Look out!`,
                            `\`\`${bosscardname}\`\` is defending!`,
                            `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                            `\`\`${randomcard}\`\` missed their attack!`,
                            `\`\`${randomcard}\`\` is defending!`,
                            `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                            `\`\`${bosscardname}\`\` is changing position!`,
                            `\`\`${randomcard}\`\` strikes!`,
                            `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                            `\`\`${bosscardname}\`\` stands their ground.`,
             `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                            `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                            `A glancing blow \`\`${randomcard}\`\`!`,
          `Need some help? \`\`${randomcard}\`\` is here!`
                            `\`\`${randomcard}\`\` is eager to get this over with.`,
                            `Oh no! \`\`${bosscardname}\`\` is powering up!`,
                            `Never gonna give \`\`${randomcard}\`\` up!`,
                            `\`\`${randomcard}\`\` is giving it all they got!`,
                            `\`\`${randomcard}\`\` takes guard against \`\`${bosscardname}\`\``,
                            `\`\`${randomcard}\`\` attempts to lead the next attack!`,
          `Who needs a plan when you got \`\`${randomcard}\`\` ?!`,
                            `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
                          ];
                        randomslur8 =
                          slursarry[Math.floor(Math.random() * slursarry.length)];
                        message.channel.send(randomslur8);
    setTimeout(() => {
      resultEmbed.setColor(`#32CD32`)
      message.channel.send(resultEmbed)
    }, 1000)
                      }, 2000);
                    }, 4000);
                  }, 500);
                }, 2000);
              }, 4000);
            }, 500);
          }, 2000);
        }, 4000);

      if (num < winchance) {




        if (bossdifficulty === 1) {

          rewardsarray = [2,3,4,"2c","1c","3c","1uc"];
          reward = rewardsarray[Math.floor(Math.random() * rewardsarray.length)];
          console.log(`HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ${reward}`);
          for (let itemone of cardsarray) {
            const thisistheguy = await Report.findOne({
              userid: itemone.cardowner
            });
            if (reward === 2) {
              var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 2;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
              console.log(winmsg);
            }
            if (reward === 3) {
                  var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 3;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
            }
            if (reward === 4) {
                  var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 4;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
            }
            if (reward === "1uc") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("1uc");

              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Uncommon"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finaluncommoncard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc);
                  console.log(`card stats ${thisistheguy.cardstats}`);
                  console.log(`BEfore Saving ${carduc}`);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                        carduc.cardtype
                      }) - ${carduc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "1c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
              var winmsg = []
  console.log("1c");
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });
                  var upgrade = 1;
                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  console.log(cardc);
                  thisistheguy.cardstats.push(cardc);
                  var carditname = cardc.cardname
                  var cardittype = cardc.cardtype
                  console.log(cardc.cardname);
                  console.log(cardc.cardtype);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${cardcitname} - (${
                        cardittype
                      }) - ${cardc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)

                })
                .catch(err => console.log(err));


            }
            if (reward === "2c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("2c");
              var commoncardarray = [];
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });

                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardcc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardcc);

                  finalcommoncard1 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card1);

                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `\n <@${itemone.cardowner}> won \`\`${cardcc.cardname} - (${
                        cardcc.cardtype
                      }) - ${cardcc.element}\`\` \n \`\`${card1.cardname} - (${
                        card1.cardtype
                      }) - ${card1.element}\`\` from the boss fight`
                    );

                      resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));


            }
            if (reward === "3c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("3c");
              var commoncardarray = [];
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });

                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardc);

                  finalcommoncard1 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card1);

                  finalcommoncard2 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card2 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard2[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card2);

                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `\n <@${itemone.cardowner}> won \`\`${cardc.cardname} - (${
                        cardc.cardtype
                      }) - ${cardc.element}\`\` \`\`${card1.cardname} - (${
                        card1.cardtype
                      }) - ${card1.element}\`\` \`\`${card2.cardname} - (${
                        card2.cardtype
                      }) - ${card2.element}\`\` from the boss fight`
                    );

                      resultEmbed.addField(`Rewards`, winmsg)

                })
                .catch(err => console.log(err));


            }
          }



        }
        if (bossdifficulty === 2) {

          rewardsarray = [4,5,6,"2c","3c","1uc", "2uc"];
          reward = rewardsarray[Math.floor(Math.random() * rewardsarray.length)];
          console.log(`HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ${reward}`);
          for (let itemone of cardsarray) {
            const thisistheguy = await Report.findOne({
              userid: itemone.cardowner
            });
            if (reward === 4) {
              var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 4;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
              console.log(winmsg);
            }
            if (reward === 5) {
                  var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 5;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
            }
            if (reward === 6) {
                  var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 6;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
            }
            if (reward === "1uc") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("1uc");

              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Uncommon"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finaluncommoncard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc);
                  console.log(`card stats ${thisistheguy.cardstats}`);
                  console.log(`BEfore Saving ${carduc}`);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                        carduc.cardtype
                      }) - ${carduc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "1c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
              var winmsg = []
  console.log("1c");
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });
                  var upgrade = 1;
                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  console.log(cardc);
                  thisistheguy.cardstats.push(cardc);
                  var carditname = cardc.cardname
                  var cardittype = cardc.cardtype
                  console.log(cardc.cardname);
                  console.log(cardc.cardtype);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carditname} - (${
                        cardittype
                      }) - ${cardc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)

                })
                .catch(err => console.log(err));


            }
            if (reward === "2c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("2c");
              var commoncardarray = [];
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });

                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardcc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardcc);

                  finalcommoncard1 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card1);

                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `\n <@${itemone.cardowner}> won \`\`${cardcc.cardname} - (${
                        cardcc.cardtype
                      }) - ${cardcc.element}\`\` \`\`${card1.cardname} - (${
                        card1.cardtype
                      }) - ${card1.element}\`\` from the boss fight`
                    );

                      resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));


            }
            if (reward === "3c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("3c");
              var commoncardarray = [];
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });

                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardc);

                  finalcommoncard1 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card1);

                  finalcommoncard2 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card2 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard2[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card2);

                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `\n <@${itemone.cardowner}> won \`\`${cardc.cardname} - (${
                        cardc.cardtype
                      }) - ${cardc.element}\`\` \`\`${card1.cardname} - (${
                        card1.cardtype
                      }) - ${card1.element}\`\` \`\`${card2.cardname} - (${
                        card2.cardtype
                      }) - ${card2.element}\`\` from the boss fight`
                    );

                      resultEmbed.addField(`Rewards`, winmsg)

                })
                .catch(err => console.log(err));


            }
            if (reward === "2uc") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("1uc");

              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Uncommon"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finaluncommoncard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc);
                  finaluncommoncard1 =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc1);
                  console.log(`card stats ${thisistheguy.cardstats}`);
                  console.log(`BEfore Saving ${carduc}`);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                        carduc.cardtype
                      }) - ${carduc.element}\`\` \`\`${carduc1.cardname} - (${
                        carduc1.cardtype
                      }) - ${carduc1.element}\`\`from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
          }



        }
        if (bossdifficulty === 3) {

          rewardsarray = [5,6,7,"2c","3c","1uc","1r"];
          reward = rewardsarray[Math.floor(Math.random() * rewardsarray.length)];
          console.log(`HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ${reward}`);
          for (let itemone of cardsarray) {
            const thisistheguy = await Report.findOne({
              userid: itemone.cardowner
            });
            if (reward === 5) {
              var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 5;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
              console.log(winmsg);
            }
            if (reward === 6) {
                  var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 6;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
            }
            if (reward === 7) {
                  var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 7;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
            }
            if (reward === "1uc") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("1uc");

              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Uncommon"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finaluncommoncard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc);
                  console.log(`card stats ${thisistheguy.cardstats}`);
                  console.log(`BEfore Saving ${carduc}`);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                        carduc.cardtype
                      }) - ${carduc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "1r") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []


              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Rare"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finalrarecard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   cardr = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalrarecard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardr);


                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${cardr.cardname} - (${
                        cardr.cardtype
                      }) - ${cardr.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "1c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
              var winmsg = []
  console.log("1c");
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });
                  var upgrade = 1;
                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  console.log(cardc);
                  thisistheguy.cardstats.push(cardc);
                  var carditname = cardc.cardname
                  var cardittype = cardc.cardtype
                  console.log(cardc.cardname);
                  console.log(cardc.cardtype);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carditname} - (${
                        cardittype
                      }) - ${cardc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)

                })
                .catch(err => console.log(err));


            }
            if (reward === "2c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("2c");
              var commoncardarray = [];
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });

                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardcc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardcc);

                  finalcommoncard1 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card1);

                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `\n <@${itemone.cardowner}> won \`\`${cardcc.cardname} - (${
                        cardcc.cardtype
                      }) - ${cardcc.element}\`\` \`\`${card1.cardname} - (${
                        card1.cardtype
                      }) - ${card1.element}\`\` from the boss fight`
                    );

                      resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));


            }
            if (reward === "3c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("3c");
              var commoncardarray = [];
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });

                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardc);

                  finalcommoncard1 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card1);

                  finalcommoncard2 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card2 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard2[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card2);

                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `\n <@${itemone.cardowner}> won \`\`${cardc.cardname} - (${
                        cardc.cardtype
                      }) - ${cardc.element}\`\` \`\`${card1.cardname} - (${
                        card1.cardtype
                      }) - ${card1.element}\`\` \`\`${card2.cardname} - (${
                        card2.cardtype
                      }) - ${card2.element}\`\` from the boss fight`
                    );

                      resultEmbed.addField(`Rewards`, winmsg)

                })
                .catch(err => console.log(err));


            }
            if (reward === "2uc") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("2uc");

              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Uncommon"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finaluncommoncard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc);
                  finaluncommoncard1 =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc1);
                  console.log(`card stats ${thisistheguy.cardstats}`);
                  console.log(`BEfore Saving ${carduc}`);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                        carduc.cardtype
                      }) - ${carduc.element}\`\` \`\`${carduc1.cardname} - (${
                        carduc1.cardtype
                      }) - ${carduc1.element}\`\`  from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
          }



        }
        if (bossdifficulty === 4) {

          rewardsarray = [6,7,8,"3c","1r", "2r"];
          reward = rewardsarray[Math.floor(Math.random() * rewardsarray.length)];
          console.log(`HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ${reward}`);
          for (let itemone of cardsarray) {
            const thisistheguy = await Report.findOne({
              userid: itemone.cardowner
            });
            if (reward === 6) {
              var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 6;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
              console.log(winmsg);
            }
            if (reward === 7) {
                  var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 7;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
            }
            if (reward === 8) {
                  var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 8;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
            }
            if (reward === "1uc") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("1uc");

              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Uncommon"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finaluncommoncard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc);
                  console.log(`card stats ${thisistheguy.cardstats}`);
                  console.log(`BEfore Saving ${carduc}`);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                        carduc.cardtype
                      }) - ${carduc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "2r") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []


              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Rare"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finalrarecard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   cardr = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalrarecard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardr);
                  finalrarecard1 =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   cardr1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalrarecard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardr1);


                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${cardr.cardname} - (${
                        cardr.cardtype
                      }) - ${cardr.element}\`\` \`\`${cardr1.cardname} - (${
                        cardr1.cardtype
                      }) - ${cardr1.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "1r") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []


              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Rare"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finalrarecard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   cardr = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalrarecard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardr);


                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${cardr.cardname} - (${
                        cardr.cardtype
                      }) - ${cardr.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "1c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
              var winmsg = []
  console.log("1c");
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });
                  var upgrade = 1;
                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  console.log(cardc);
                  thisistheguy.cardstats.push(cardc);
                  var carditname = cardc.cardname
                  var cardittype = cardc.cardtype
                  console.log(cardc.cardname);
                  console.log(cardc.cardtype);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carditname} - (${
                        cardittype
                      }) - ${cardc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)

                })
                .catch(err => console.log(err));


            }
            if (reward === "2c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("2c");
              var commoncardarray = [];
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });

                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardcc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardcc);

                  finalcommoncard1 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card1);

                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `\n <@${itemone.cardowner}> won \`\`${cardcc.cardname} - (${
                        cardcc.cardtype
                      }) - ${cardcc.element}\`\` \`\`${card1.cardname} - (${
                        card1.cardtype
                      }) - ${card1.element}\`\` from the boss fight`
                    );

                      resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));


            }
            if (reward === "3c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("3c");
              var commoncardarray = [];
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });

                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardc);

                  finalcommoncard1 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card1);

                  finalcommoncard2 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card2 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard2[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card2);

                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `\n <@${itemone.cardowner}> won \`\`${cardc.cardname} - (${
                        cardc.cardtype
                      }) - ${cardc.element}\`\` \`\`${card1.cardname} - (${
                        card1.cardtype
                      }) - ${card1.element}\`\` \`\`${card2.cardname} - (${
                        card2.cardtype
                      }) - ${card2.element}\`\` from the boss fight`
                    );

                      resultEmbed.addField(`Rewards`, winmsg)

                })
                .catch(err => console.log(err));


            }
            if (reward === "1uc") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("1uc");

              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Uncommon"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finaluncommoncard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc);
                  finaluncommoncard1 =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc1);
                  console.log(`card stats ${thisistheguy.cardstats}`);
                  console.log(`BEfore Saving ${carduc}`);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                        carduc.cardtype
                      }) - ${carduc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
          }



        }
        if (bossdifficulty === 5) {

          rewardsarray = [8,9,10,"3c","1r","2r","1e"];
          reward = rewardsarray[Math.floor(Math.random() * rewardsarray.length)];
          console.log(`HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ${reward}`);
          for (let itemone of cardsarray) {
            const thisistheguy = await Report.findOne({
              userid: itemone.cardowner
            });
            if (reward === 8) {
              var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 8;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
              console.log(winmsg);
            }
            if (reward === 9) {
                  var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 9;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
            }
            if (reward === 10) {
                  var winmsg = []
              thisistheguy.dust = thisistheguy.dust + 10;
              thisistheguy
                .save()
                .then(done => console.log("done"))
                .catch(err => console.log(err));
              winmsg.push(
                `<@${
                  itemone.cardowner
                }> won \`\`${reward} dust\`\` from the boss fight `
              );
              resultEmbed.addField(`Rewards`, winmsg)
            }
            if (reward === "1uc") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("1uc");

              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Uncommon"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finaluncommoncard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc);
                  console.log(`card stats ${thisistheguy.cardstats}`);
                  console.log(`BEfore Saving ${carduc}`);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                        carduc.cardtype
                      }) - ${carduc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "2r") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []


              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Rare"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finalrarecard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   cardr = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardr);
                  finalrarecard1 =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   cardr1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalrarecard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardr1);


                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${cardr.cardname} - (${
                        cardr.cardtype
                      }) - ${cardr.element}\`\` \`\`${cardr1.cardname} - (${
                        cardr1.cardtype
                      }) - ${cardr1.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "1e") {
              console.log(reward);
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []


              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Epic"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finalepiccard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carde = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalepiccard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardr);


                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carde.cardname} - (${
                        carde.cardtype
                      }) - ${carde.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "1r") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []


              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Rare"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finalrarecard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   cardr = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalrarecard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardr);


                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${cardr.cardname} - (${
                        cardr.cardtype
                      }) - ${cardr.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
            if (reward === "1c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
              var winmsg = []
  console.log("1c");
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });
                  var upgrade = 1;
                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  console.log(cardc);
                  thisistheguy.cardstats.push(cardc);
                  var carditname = cardc.cardname
                  var cardittype = cardc.cardtype
                  console.log(cardc.cardname);
                  console.log(cardc.cardtype);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carditname} - (${
                        cardittype
                      }) - ${cardc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)

                })
                .catch(err => console.log(err));


            }
            if (reward === "2c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("2c");
              var commoncardarray = [];
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });

                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardcc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardcc);

                  finalcommoncard1 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card1);

                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `\n <@${itemone.cardowner}> won \`\`${cardcc.cardname} - (${
                        cardcc.cardtype
                      }) - ${cardcc.element}\`\` \`\`${card1.cardname} - (${
                        card1.cardtype
                      }) - ${card1.element}\`\` from the boss fight`
                    );

                      resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));


            }
            if (reward === "3c") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("3c");
              var commoncardarray = [];
              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Common"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    commoncardarray.push(item);
                  });

                  finalcommoncard =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   cardc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(cardc);

                  finalcommoncard1 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard1[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card1);

                  finalcommoncard2 =
                    commoncardarray[
                      Math.floor(Math.random() * commoncardarray.length)
                    ];
                   card2 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finalcommoncard2[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(card2);

                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `\n <@${itemone.cardowner}> won \`\`${cardc.cardname} - (${
                        cardc.cardtype
                      }) - ${cardc.element}\`\` \`\`${card1.cardname} - (${
                        card1.cardtype
                      }) - ${card1.element}\`\` \`\`${card2.cardname} - (${
                        card2.cardtype
                      }) - ${card2.element}\`\` from the boss fight`
                    );

                      resultEmbed.addField(`Rewards`, winmsg)

                })
                .catch(err => console.log(err));


            }
            if (reward === "1uc") {
              var cardc = []
              var cardcc = []
              var card1 =[]
              var card2 = []
              var carduc = []
              var carduc1 = []
              var carduc2 = []
              var cardr = []
              var cardr1 = []
              var cardr1 = []
              var uncommoncardarray = [];
              var commoncardarray = [];
                 var winmsg = []
              console.log("1uc");

              // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
              Addcard.find({
                cardtype: "Uncommon"
              })
                .then(result => {
                  result.forEach((item, i) => {
                    uncommoncardarray.push(item);
                  });

                  finaluncommoncard =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc);
                  finaluncommoncard1 =
                    uncommoncardarray[
                      Math.floor(Math.random() * uncommoncardarray.length)
                    ];
                   carduc1 = [
                    "cardname",
                    "cardtype",
                    "cardscore",
                    "element",
                    "strength",
                    "endurance",
                    "vitality",
                    "leadership",
                    "intellect",
                    "series",
                    "imgurl"
                  ].reduce(
                    (carry, key) => {
                      carry[key] = finaluncommoncard[key];
                      return carry;
                    },
                    {
                      upgrade: 0,
                      cardid: Math.random()
                        .toString(20)
                        .substr(2, 6)
                    }
                  );
                  // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                  thisistheguy.cardstats.push(carduc1);
                  console.log(`card stats ${thisistheguy.cardstats}`);
                  console.log(`BEfore Saving ${carduc}`);
                  thisistheguy
                    .save()
                    .then(done => console.log(`card saved`))
                    .catch(err => console.log(err));
                    winmsg.push(
                      `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                        carduc.cardtype
                      }) - ${carduc.element}\`\` from the boss fight `
                    );
                    resultEmbed.addField(`Rewards`, winmsg)
                })
                .catch(err => console.log(err));






            }
          }



        }



  // const resultEmbed = new Discord.MessageEmbed().setTitle('Boss fight results');
  // resultEmbed.addField(`Rewards`, winmsg)
  // message.channel.send(resultEmbed)

      }

return
    }

    let lightn = 0;
    let darkn = 0;
    let earthn = 0;
    let watern = 0;
    let firen = 0;
    let airn = 0;
    let dualn = 0;
    var winchance = 20;
    console.log(`THIS IS THE ELEMENT ARRAY ${elementarray}`);

    elementarray.forEach(x => x == "Light" && lightn++);
    elementarray.forEach(x => x == "Dark" && darkn++);
    elementarray.forEach(x => x == "Earth" && earthn++);
    elementarray.forEach(x => x == "Water" && watern++);
    elementarray.forEach(x => x == "Fire" && firen++);
    elementarray.forEach(x => x == "Air" && airn++);
    elementarray.forEach(x => x == "Dual" && dualn++);

    if (bosselement === "Water") {
      winchance = winchance + airn * 5;
    }
    if (bosselement === "Fire") {
      winchance = winchance + watern * 5;
    }
    if (bosselement === "Earth") {
      winchance = winchance + firen * 5;
    }
    if (bosselement === "Air") {
      winchance = winchance + earthn * 5;
    }
    var num = Math.random() * 100;
    console.log(`THIS IS NUM ${num}`);
    // IF THE PLAYERS STILL WIN-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const resultEmbed = new Discord.MessageEmbed().setTitle('Boss fight results');
    console.log(`not much winchance ${winchance}`);
    var randomcard =
      cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
    var randomcard1 =
      cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
    var slursarry = [
      `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
      `  is leading the battle!`,
      `\`\`${randomcard}\`\` isn't giving up!`,
      `\`\`${randomcard}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
      `The raid party is working well together!`,
      `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
      `\`\`${randomcard}\`\` prepares an attack! Look out!`,
      `\`\`${randomcard}\`\` is defending!`,
      `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
      `\`\`${randomcard}\`\` missed their attack!`,
      `\`\`${randomcard}\`\` is defending!`,
      `That attack landed \`\`${randomcard}\`\`! Nice one!`,
      `\`\`${randomcard}\`\` is changing position!`,
      `\`\`${randomcard}\`\` strikes!`,
      `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
      `\`\`${randomcard}\`\` stands their ground.`,
      `\`\`${randomcard}\`\` made a mistake. Sorry!`,
      `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
      `A glancing blow \`\`${randomcard}\`\`!`,
      `\`\`${randomcard}\`\` is eager to get this over with.`,
      `Oh no! \`\`${randomcard}\`\` is powering up!`,
      `Never gonna give \`\`${randomcard}\`\` up!`,
      `\`\`${randomcard}\`\` is giving it all they got!`,
      `\`\`${randomcard}\`\` takes guard against \`\`${randomcard}\`\``,
      `\`\`${randomcard}\`\` attempts to lead the next attack!`,
      `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
    ];

    console.log(cardnamearray);
    setTimeout(() => {
      console.log(Math.floor(Math.random() * cardnamearray.length));
      randomcard =
        cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
      randomcard1 =
        cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
      var slursarry = [
        `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
        `\`\`${randomcard}\`\` is leading the battle!`,
        `\`\`${randomcard}\`\` isn't giving up!`,
        `\`\`${randomcard}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
        `The raid party is working well together!`,
        `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
        `\`\`${randomcard}\`\` prepares an attack! Look out!`,
        `\`\`${randomcard}\`\` is defending!`,
        `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
        `\`\`${randomcard}\`\` missed their attack!`,
        `\`\`${randomcard}\`\` is defending!`,
        `That attack landed \`\`${randomcard}\`\`! Nice one!`,
        `\`\`${randomcard}\`\` is changing position!`,
        `\`\`${randomcard}\`\` strikes!`,
        `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
        `\`\`${randomcard}\`\` stands their ground.`,
        `\`\`${randomcard}\`\` made a mistake. Sorry!`,
        `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
        `A glancing blow \`\`${randomcard}\`\`!`,
        `\`\`${randomcard}\`\` is eager to get this over with.`,
        `Oh no! \`\`${randomcard}\`\` is powering up!`,
        `Never gonna give \`\`${randomcard}\`\` up!`,
        `\`\`${randomcard}\`\` is giving it all they got!`,
        `\`\`${randomcard}\`\` takes guard against \`\`${randomcard}\`\``,
        `\`\`${randomcard}\`\` attempts to lead the next attack!`,
        `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
      ];
      randomslur1 = slursarry[Math.floor(Math.random() * slursarry.length)];
      message.channel.send(randomslur1);
      setTimeout(() => {
        console.log(Math.floor(Math.random() * cardnamearray.length));

        randomcard =
          cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
        randomcard1 =
          cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
        var slursarry = [
          `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
          `\`\`${randomcard}\`\` is leading the battle!`,
          `\`\`${randomcard}\`\` isn't giving up!`,
          `\`\`${randomcard}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
          `The raid party is working well together!`,
          `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
          `\`\`${randomcard}\`\` prepares an attack! Look out!`,
          `\`\`${randomcard}\`\` is defending!`,
          `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
          `\`\`${randomcard}\`\` missed their attack!`,
          `\`\`${randomcard}\`\` is defending!`,
          `That attack landed \`\`${randomcard}\`\`! Nice one!`,
          `\`\`${randomcard}\`\` is changing position!`,
          `\`\`${randomcard}\`\` strikes!`,
          `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
          `\`\`${randomcard}\`\` stands their ground.`,
          `\`\`${randomcard}\`\` made a mistake. Sorry!`,
          `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
          `A glancing blow \`\`${randomcard}\`\`!`,
          `\`\`${randomcard}\`\` is eager to get this over with.`,
          `Oh no! \`\`${randomcard}\`\` is powering up!`,
          `Never gonna give \`\`${randomcard}\`\` up!`,
          `\`\`${randomcard}\`\` is giving it all they got!`,
          `\`\`${randomcard}\`\` takes guard against \`\`${randomcard}\`\``,
          `\`\`${randomcard}\`\` attempts to lead the next attack!`,
          `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
        ];
        randomslur2 = slursarry[Math.floor(Math.random() * slursarry.length)];
        message.channel.send(randomslur2);
        setTimeout(() => {
          console.log(Math.floor(Math.random() * cardnamearray.length));
          randomcard =
            cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
          randomcard1 =
            cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
          var slursarry = [
            `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
            `\`\`${randomcard}\`\` is leading the battle!`,
            `\`\`${randomcard}\`\` isn't giving up!`,
            `\`\`${randomcard}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
            `The raid party is working well together!`,
            `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
            `\`\`${randomcard}\`\` prepares an attack! Look out!`,
            `\`\`${randomcard}\`\` is defending!`,
            `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
            `\`\`${randomcard}\`\` missed their attack!`,
            `\`\`${randomcard}\`\` is defending!`,
            `That attack landed \`\`${randomcard}\`\`! Nice one!`,
            `\`\`${randomcard}\`\` is changing position!`,
            `\`\`${randomcard}\`\` strikes!`,
            `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
            `\`\`${randomcard}\`\` stands their ground.`,
            `\`\`${randomcard}\`\` made a mistake. Sorry!`,
            `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
            `A glancing blow \`\`${randomcard}\`\`!`,
            `\`\`${randomcard}\`\` is eager to get this over with.`,
            `Oh no! \`\`${randomcard}\`\` is powering up!`,
            `Never gonna give \`\`${randomcard}\`\` up!`,
            `\`\`${randomcard}\`\` is giving it all they got!`,
            `\`\`${randomcard}\`\` takes guard against \`\`${randomcard}\`\``,
            `\`\`${randomcard}\`\` attempts to lead the next attack!`,
            `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
          ];
          randomslur3 = slursarry[Math.floor(Math.random() * slursarry.length)];
          message.channel.send(randomslur3);
          setTimeout(() => {
            console.log(Math.floor(Math.random() * cardnamearray.length));
            randomcard =
              cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
            randomcard1 =
              cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
            var slursarry = [
              `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
              `\`\`${randomcard}\`\` is leading the battle!`,
              `\`\`${randomcard}\`\` isn't giving up!`,
              `\`\`${randomcard}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
              `The raid party is working well together!`,
              `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
              `\`\`${randomcard}\`\` prepares an attack! Look out!`,
              `\`\`${randomcard}\`\` is defending!`,
              `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
              `\`\`${randomcard}\`\` missed their attack!`,
              `\`\`${randomcard}\`\` is defending!`,
              `That attack landed \`\`${randomcard}\`\`! Nice one!`,
              `\`\`${randomcard}\`\` is changing position!`,
              `\`\`${randomcard}\`\` strikes!`,
              `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
              `\`\`${randomcard}\`\` stands their ground.`,
              `\`\`${randomcard}\`\` made a mistake. Sorry!`,
              `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
              `A glancing blow \`\`${randomcard}\`\`!`,
              `\`\`${randomcard}\`\` is eager to get this over with.`,
              `Oh no! \`\`${randomcard}\`\` is powering up!`,
              `Never gonna give \`\`${randomcard}\`\` up!`,
              `\`\`${randomcard}\`\` is giving it all they got!`,
              `\`\`${randomcard}\`\` takes guard against \`\`${randomcard}\`\``,
              `\`\`${randomcard}\`\` attempts to lead the next attack!`,
              `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
            ];
            randomslur4 =
              slursarry[Math.floor(Math.random() * slursarry.length)];
            message.channel.send(randomslur4);
            setTimeout(() => {
              console.log(Math.floor(Math.random() * cardnamearray.length));
              randomcard =
                cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
              randomcard1 =
                cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
              var slursarry = [
                `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                `\`\`${randomcard}\`\` is leading the battle!`,
                `\`\`${randomcard}\`\` isn't giving up!`,
                `\`\`${randomcard}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                `The raid party is working well together!`,
                `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                `\`\`${randomcard}\`\` prepares an attack! Look out!`,
                `\`\`${randomcard}\`\` is defending!`,
                `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                `\`\`${randomcard}\`\` missed their attack!`,
                `\`\`${randomcard}\`\` is defending!`,
                `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                `\`\`${randomcard}\`\` is changing position!`,
                `\`\`${randomcard}\`\` strikes!`,
                `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                `\`\`${randomcard}\`\` stands their ground.`,
                `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                `A glancing blow \`\`${randomcard}\`\`!`,
                `\`\`${randomcard}\`\` is eager to get this over with.`,
                `Oh no! \`\`${randomcard}\`\` is powering up!`,
                `Never gonna give \`\`${randomcard}\`\` up!`,
                `\`\`${randomcard}\`\` is giving it all they got!`,
                `\`\`${randomcard}\`\` takes guard against \`\`${randomcard}\`\``,
                `\`\`${randomcard}\`\` attempts to lead the next attack!`,
                `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
              ];
              randomslur5 =
                slursarry[Math.floor(Math.random() * slursarry.length)];
              message.channel.send(randomslur5);
              setTimeout(() => {
                console.log(Math.floor(Math.random() * cardnamearray.length));
                randomcard =
                  cardnamearray[
                    Math.floor(Math.random() * cardnamearray.length)
                  ];
                randomcard1 =
                  cardnamearray[
                    Math.floor(Math.random() * cardnamearray.length)
                  ];
                var slursarry = [
                  `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                  `\`\`${randomcard}\`\` is leading the battle!`,
                  `\`\`${randomcard}\`\` isn't giving up!`,
                  `\`\`${randomcard}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                  `The raid party is working well together!`,
                  `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                  `\`\`${randomcard}\`\` prepares an attack! Look out!`,
                  `\`\`${randomcard}\`\` is defending!`,
                  `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                  `\`\`${randomcard}\`\` missed their attack!`,
                  `\`\`${randomcard}\`\` is defending!`,
                  `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                  `\`\`${randomcard}\`\` is changing position!`,
                  `\`\`${randomcard}\`\` strikes!`,
                  `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                  `\`\`${randomcard}\`\` stands their ground.`,
                  `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                  `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                  `A glancing blow \`\`${randomcard}\`\`!`,
                  `\`\`${randomcard}\`\` is eager to get this over with.`,
                  `Oh no! \`\`${randomcard}\`\` is powering up!`,
                  `Never gonna give \`\`${randomcard}\`\` up!`,
                  `\`\`${randomcard}\`\` is giving it all they got!`,
                  `\`\`${randomcard}\`\` takes guard against \`\`${randomcard}\`\``,
                  `\`\`${randomcard}\`\` attempts to lead the next attack!`,
                  `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
                ];
                randomslur6 =
                  slursarry[Math.floor(Math.random() * slursarry.length)];
                message.channel.send(randomslur6);
                setTimeout(() => {
                  console.log(Math.floor(Math.random() * cardnamearray.length));
                  randomcard =
                    cardnamearray[
                      Math.floor(Math.random() * cardnamearray.length)
                    ];
                  randomcard1 =
                    cardnamearray[
                      Math.floor(Math.random() * cardnamearray.length)
                    ];
                  var slursarry = [
                    `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                    `\`\`${randomcard}\`\` is leading the battle!`,
                    `\`\`${randomcard}\`\` isn't giving up!`,
                    `\`\`${randomcard}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                    `The raid party is working well together!`,
                    `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                    `\`\`${randomcard}\`\` prepares an attack! Look out!`,
                    `\`\`${randomcard}\`\` is defending!`,
                    `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                    `\`\`${randomcard}\`\` missed their attack!`,
                    `\`\`${randomcard}\`\` is defending!`,
                    `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                    `\`\`${randomcard}\`\` is changing position!`,
                    `\`\`${randomcard}\`\` strikes!`,
                    `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                    `\`\`${randomcard}\`\` stands their ground.`,
                    `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                    `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                    `A glancing blow \`\`${randomcard}\`\`!`,
                    `\`\`${randomcard}\`\` is eager to get this over with.`,
                    `Oh no! \`\`${randomcard}\`\` is powering up!`,
                    `Never gonna give \`\`${randomcard}\`\` up!`,
                    `\`\`${randomcard}\`\` is giving it all they got!`,
                    `\`\`${randomcard}\`\` takes guard against \`\`${randomcard}\`\``,
                    `\`\`${randomcard}\`\` attempts to lead the next attack!`,
                    `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
                  ];
                  randomslur7 =
                    slursarry[Math.floor(Math.random() * slursarry.length)];
                  message.channel.send(randomslur7);
                  setTimeout(() => {
                    console.log(
                      Math.floor(Math.random() * cardnamearray.length)
                    );
                    randomcard =
                      cardnamearray[
                        Math.floor(Math.random() * cardnamearray.length)
                      ];
                    randomcard1 =
                      cardnamearray[
                        Math.floor(Math.random() * cardnamearray.length)
                      ];
                    var slursarry = [
                      `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
                      `\`\`${randomcard}\`\` is leading the battle!`,
                      `\`\`${randomcard}\`\` isn't giving up!`,
                      `\`\`${randomcard}\`\` deals a massive blow to \`\`${randomcard1}\`\`. That's going to hurt.`,
                      `The raid party is working well together!`,
                      `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
                      `\`\`${randomcard}\`\` prepares an attack! Look out!`,
                      `\`\`${randomcard}\`\` is defending!`,
                      `\`\`${randomcard}\`\` assists \`\`${randomcard1}\`\`. Thanks!`,
                      `\`\`${randomcard}\`\` missed their attack!`,
                      `\`\`${randomcard}\`\` is defending!`,
                      `That attack landed \`\`${randomcard}\`\`! Nice one!`,
                      `\`\`${randomcard}\`\` is changing position!`,
                      `\`\`${randomcard}\`\` strikes!`,
                      `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
                      `\`\`${randomcard}\`\` stands their ground.`,
                      `\`\`${randomcard}\`\` made a mistake. Sorry!`,
                      `\`\`${randomcard}\`\` and \`\`${randomcard1}\`\` use a cooperative attack! Nice teamwork!`,
                      `A glancing blow \`\`${randomcard}\`\`!`,
                      `\`\`${randomcard}\`\` is eager to get this over with.`,
                      `Oh no! \`\`${randomcard}\`\` is powering up!`,
                      `Never gonna give \`\`${randomcard}\`\` up!`,
                      `\`\`${randomcard}\`\` is giving it all they got!`,
                      `\`\`${randomcard}\`\` takes guard against \`\`${randomcard}\`\``,
                      `\`\`${randomcard}\`\` attempts to lead the next attack!`,
                      `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`
                    ];
                    randomslur8 =
                      slursarry[Math.floor(Math.random() * slursarry.length)];
                    message.channel.send(randomslur8);
                    if(defeat === 1){
                      finalEmbed.setColor(`#FF0000`)
                      message.channel.send(finalEmbed)
                      return
                    }
setTimeout(() => {
  resultEmbed.setColor(`#32CD32`)
  message.channel.send(resultEmbed)
}, 1000)
                  }, 2000);
                }, 4000);
              }, 500);
            }, 2000);
          }, 4000);
        }, 500);
      }, 2000);
    }, 4000);

    if (num < winchance) {




      if (bossdifficulty === 1) {

        rewardsarray = [2,3,4,"2c","1c","3c","1uc"];
        reward = rewardsarray[Math.floor(Math.random() * rewardsarray.length)];
        console.log(`HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ${reward}`);
        for (let itemone of cardsarray) {
          const thisistheguy = await Report.findOne({
            userid: itemone.cardowner
          });
          if (reward === 2) {
            var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 2;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
            console.log(winmsg);
          }
          if (reward === 3) {
                var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 3;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
          }
          if (reward === 4) {
                var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 4;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
          }
          if (reward === "1uc") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("1uc");

            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Uncommon"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finaluncommoncard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc);
                console.log(`card stats ${thisistheguy.cardstats}`);
                console.log(`BEfore Saving ${carduc}`);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                      carduc.cardtype
                    }) - ${carduc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "1c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
            var winmsg = []
console.log("1c");
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });
                var upgrade = 1;
                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
console.log(cardc);
                thisistheguy.cardstats.push(cardc);
                var carditname = cardc.cardname
                var cardittype = cardc.cardtype
                console.log(cardc.cardname);
                console.log(cardc.cardtype);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${cardcitname} - (${
                      cardittype
                    }) - ${cardc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)

              })
              .catch(err => console.log(err));


          }
          if (reward === "2c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("2c");
            var commoncardarray = [];
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });

                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardcc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardcc);

                finalcommoncard1 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card1);

                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `\n <@${itemone.cardowner}> won \`\`${cardcc.cardname} - (${
                      cardcc.cardtype
                    }) - ${cardcc.element}\`\` \n \`\`${card1.cardname} - (${
                      card1.cardtype
                    }) - ${card1.element}\`\` from the boss fight`
                  );

                    resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));


          }
          if (reward === "3c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("3c");
            var commoncardarray = [];
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });

                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardc);

                finalcommoncard1 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card1);

                finalcommoncard2 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card2 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard2[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card2);

                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `\n <@${itemone.cardowner}> won \`\`${cardc.cardname} - (${
                      cardc.cardtype
                    }) - ${cardc.element}\`\` \`\`${card1.cardname} - (${
                      card1.cardtype
                    }) - ${card1.element}\`\` \`\`${card2.cardname} - (${
                      card2.cardtype
                    }) - ${card2.element}\`\` from the boss fight`
                  );

                    resultEmbed.addField(`Rewards`, winmsg)

              })
              .catch(err => console.log(err));


          }
        }



      }
      if (bossdifficulty === 2) {

        rewardsarray = [4,5,6,"2c","3c","1uc", "2uc"];
        reward = rewardsarray[Math.floor(Math.random() * rewardsarray.length)];
        console.log(`HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ${reward}`);
        for (let itemone of cardsarray) {
          const thisistheguy = await Report.findOne({
            userid: itemone.cardowner
          });
          if (reward === 4) {
            var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 4;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
            console.log(winmsg);
          }
          if (reward === 5) {
                var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 5;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
          }
          if (reward === 6) {
                var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 6;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
          }
          if (reward === "1uc") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("1uc");

            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Uncommon"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finaluncommoncard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc);
                console.log(`card stats ${thisistheguy.cardstats}`);
                console.log(`BEfore Saving ${carduc}`);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                      carduc.cardtype
                    }) - ${carduc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "1c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
            var winmsg = []
console.log("1c");
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });
                var upgrade = 1;
                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
console.log(cardc);
                thisistheguy.cardstats.push(cardc);
                var carditname = cardc.cardname
                var cardittype = cardc.cardtype
                console.log(cardc.cardname);
                console.log(cardc.cardtype);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carditname} - (${
                      cardittype
                    }) - ${cardc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)

              })
              .catch(err => console.log(err));


          }
          if (reward === "2c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("2c");
            var commoncardarray = [];
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });

                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardcc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardcc);

                finalcommoncard1 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card1);

                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `\n <@${itemone.cardowner}> won \`\`${cardcc.cardname} - (${
                      cardcc.cardtype
                    }) - ${cardcc.element}\`\` \`\`${card1.cardname} - (${
                      card1.cardtype
                    }) - ${card1.element}\`\` from the boss fight`
                  );

                    resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));


          }
          if (reward === "3c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("3c");
            var commoncardarray = [];
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });

                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardc);

                finalcommoncard1 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card1);

                finalcommoncard2 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card2 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard2[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card2);

                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `\n <@${itemone.cardowner}> won \`\`${cardc.cardname} - (${
                      cardc.cardtype
                    }) - ${cardc.element}\`\` \`\`${card1.cardname} - (${
                      card1.cardtype
                    }) - ${card1.element}\`\` \`\`${card2.cardname} - (${
                      card2.cardtype
                    }) - ${card2.element}\`\` from the boss fight`
                  );

                    resultEmbed.addField(`Rewards`, winmsg)

              })
              .catch(err => console.log(err));


          }
          if (reward === "2uc") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("1uc");

            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Uncommon"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finaluncommoncard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc);
                finaluncommoncard1 =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc1);
                console.log(`card stats ${thisistheguy.cardstats}`);
                console.log(`BEfore Saving ${carduc}`);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                      carduc.cardtype
                    }) - ${carduc.element}\`\` \`\`${carduc1.cardname} - (${
                      carduc1.cardtype
                    }) - ${carduc1.element}\`\`from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
        }



      }
      if (bossdifficulty === 3) {

        rewardsarray = [5,6,7,"2c","3c","1uc","1r"];
        reward = rewardsarray[Math.floor(Math.random() * rewardsarray.length)];
        console.log(`HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ${reward}`);
        for (let itemone of cardsarray) {
          const thisistheguy = await Report.findOne({
            userid: itemone.cardowner
          });
          if (reward === 5) {
            var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 5;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
            console.log(winmsg);
          }
          if (reward === 6) {
                var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 6;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
          }
          if (reward === 7) {
                var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 7;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
          }
          if (reward === "1uc") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("1uc");

            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Uncommon"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finaluncommoncard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc);
                console.log(`card stats ${thisistheguy.cardstats}`);
                console.log(`BEfore Saving ${carduc}`);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                      carduc.cardtype
                    }) - ${carduc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "1r") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []


            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Rare"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finalrarecard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 cardr = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalrarecard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardr);


                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${cardr.cardname} - (${
                      cardr.cardtype
                    }) - ${cardr.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "1c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
            var winmsg = []
console.log("1c");
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });
                var upgrade = 1;
                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
console.log(cardc);
                thisistheguy.cardstats.push(cardc);
                var carditname = cardc.cardname
                var cardittype = cardc.cardtype
                console.log(cardc.cardname);
                console.log(cardc.cardtype);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carditname} - (${
                      cardittype
                    }) - ${cardc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)

              })
              .catch(err => console.log(err));


          }
          if (reward === "2c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("2c");
            var commoncardarray = [];
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });

                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardcc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardcc);

                finalcommoncard1 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card1);

                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `\n <@${itemone.cardowner}> won \`\`${cardcc.cardname} - (${
                      cardcc.cardtype
                    }) - ${cardcc.element}\`\` \`\`${card1.cardname} - (${
                      card1.cardtype
                    }) - ${card1.element}\`\` from the boss fight`
                  );

                    resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));


          }
          if (reward === "3c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("3c");
            var commoncardarray = [];
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });

                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardc);

                finalcommoncard1 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card1);

                finalcommoncard2 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card2 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard2[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card2);

                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `\n <@${itemone.cardowner}> won \`\`${cardc.cardname} - (${
                      cardc.cardtype
                    }) - ${cardc.element}\`\` \`\`${card1.cardname} - (${
                      card1.cardtype
                    }) - ${card1.element}\`\` \`\`${card2.cardname} - (${
                      card2.cardtype
                    }) - ${card2.element}\`\` from the boss fight`
                  );

                    resultEmbed.addField(`Rewards`, winmsg)

              })
              .catch(err => console.log(err));


          }
          if (reward === "2uc") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("2uc");

            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Uncommon"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finaluncommoncard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc);
                finaluncommoncard1 =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc1);
                console.log(`card stats ${thisistheguy.cardstats}`);
                console.log(`BEfore Saving ${carduc}`);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                      carduc.cardtype
                    }) - ${carduc.element}\`\` \`\`${carduc1.cardname} - (${
                      carduc1.cardtype
                    }) - ${carduc1.element}\`\`  from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
        }



      }
      if (bossdifficulty === 4) {

        rewardsarray = [6,7,8,"3c","1r", "2r"];
        reward = rewardsarray[Math.floor(Math.random() * rewardsarray.length)];
        console.log(`HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ${reward}`);
        for (let itemone of cardsarray) {
          const thisistheguy = await Report.findOne({
            userid: itemone.cardowner
          });
          if (reward === 6) {
            var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 6;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
            console.log(winmsg);
          }
          if (reward === 7) {
                var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 7;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
          }
          if (reward === 8) {
                var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 8;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
          }
          if (reward === "1uc") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("1uc");

            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Uncommon"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finaluncommoncard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc);
                console.log(`card stats ${thisistheguy.cardstats}`);
                console.log(`BEfore Saving ${carduc}`);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                      carduc.cardtype
                    }) - ${carduc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "2r") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []


            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Rare"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finalrarecard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 cardr = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalrarecard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardr);
                finalrarecard1 =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 cardr1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalrarecard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardr1);


                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${cardr.cardname} - (${
                      cardr.cardtype
                    }) - ${cardr.element}\`\` \`\`${cardr1.cardname} - (${
                      cardr1.cardtype
                    }) - ${cardr1.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "1r") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []


            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Rare"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finalrarecard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 cardr = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalrarecard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardr);


                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${cardr.cardname} - (${
                      cardr.cardtype
                    }) - ${cardr.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "1c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
            var winmsg = []
console.log("1c");
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });
                var upgrade = 1;
                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
console.log(cardc);
                thisistheguy.cardstats.push(cardc);
                var carditname = cardc.cardname
                var cardittype = cardc.cardtype
                console.log(cardc.cardname);
                console.log(cardc.cardtype);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carditname} - (${
                      cardittype
                    }) - ${cardc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)

              })
              .catch(err => console.log(err));


          }
          if (reward === "2c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("2c");
            var commoncardarray = [];
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });

                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardcc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardcc);

                finalcommoncard1 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card1);

                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `\n <@${itemone.cardowner}> won \`\`${cardcc.cardname} - (${
                      cardcc.cardtype
                    }) - ${cardcc.element}\`\` \`\`${card1.cardname} - (${
                      card1.cardtype
                    }) - ${card1.element}\`\` from the boss fight`
                  );

                    resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));


          }
          if (reward === "3c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("3c");
            var commoncardarray = [];
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });

                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardc);

                finalcommoncard1 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card1);

                finalcommoncard2 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card2 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard2[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card2);

                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `\n <@${itemone.cardowner}> won \`\`${cardc.cardname} - (${
                      cardc.cardtype
                    }) - ${cardc.element}\`\` \`\`${card1.cardname} - (${
                      card1.cardtype
                    }) - ${card1.element}\`\` \`\`${card2.cardname} - (${
                      card2.cardtype
                    }) - ${card2.element}\`\` from the boss fight`
                  );

                    resultEmbed.addField(`Rewards`, winmsg)

              })
              .catch(err => console.log(err));


          }
          if (reward === "1uc") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("1uc");

            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Uncommon"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finaluncommoncard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc);
                finaluncommoncard1 =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc1);
                console.log(`card stats ${thisistheguy.cardstats}`);
                console.log(`BEfore Saving ${carduc}`);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                      carduc.cardtype
                    }) - ${carduc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
        }



      }
      if (bossdifficulty === 5) {

        rewardsarray = [8,9,10,"3c","1r","2r","1e"];
        reward = rewardsarray[Math.floor(Math.random() * rewardsarray.length)];
        console.log(`HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ${reward}`);
        for (let itemone of cardsarray) {
          const thisistheguy = await Report.findOne({
            userid: itemone.cardowner
          });
          if (reward === 8) {
            var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 8;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
            console.log(winmsg);
          }
          if (reward === 9) {
                var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 9;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
          }
          if (reward === 10) {
                var winmsg = []
            thisistheguy.dust = thisistheguy.dust + 10;
            thisistheguy
              .save()
              .then(done => console.log("done"))
              .catch(err => console.log(err));
            winmsg.push(
              `<@${
                itemone.cardowner
              }> won \`\`${reward} dust\`\` from the boss fight `
            );
            resultEmbed.addField(`Rewards`, winmsg)
          }
          if (reward === "1uc") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("1uc");

            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Uncommon"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finaluncommoncard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc);
                console.log(`card stats ${thisistheguy.cardstats}`);
                console.log(`BEfore Saving ${carduc}`);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                      carduc.cardtype
                    }) - ${carduc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "2r") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []


            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Rare"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finalrarecard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 cardr = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardr);
                finalrarecard1 =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 cardr1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalrarecard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardr1);


                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${cardr.cardname} - (${
                      cardr.cardtype
                    }) - ${cardr.element}\`\` \`\`${cardr1.cardname} - (${
                      cardr1.cardtype
                    }) - ${cardr1.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "1e") {
            console.log(reward);
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []


            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Epic"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finalepiccard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carde = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalepiccard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardr);


                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carde.cardname} - (${
                      carde.cardtype
                    }) - ${carde.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "1r") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []


            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Rare"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finalrarecard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 cardr = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalrarecard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardr);


                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${cardr.cardname} - (${
                      cardr.cardtype
                    }) - ${cardr.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
          if (reward === "1c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
            var winmsg = []
console.log("1c");
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });
                var upgrade = 1;
                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
console.log(cardc);
                thisistheguy.cardstats.push(cardc);
                var carditname = cardc.cardname
                var cardittype = cardc.cardtype
                console.log(cardc.cardname);
                console.log(cardc.cardtype);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carditname} - (${
                      cardittype
                    }) - ${cardc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)

              })
              .catch(err => console.log(err));


          }
          if (reward === "2c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("2c");
            var commoncardarray = [];
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });

                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardcc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardcc);

                finalcommoncard1 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card1);

                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `\n <@${itemone.cardowner}> won \`\`${cardcc.cardname} - (${
                      cardcc.cardtype
                    }) - ${cardcc.element}\`\` \`\`${card1.cardname} - (${
                      card1.cardtype
                    }) - ${card1.element}\`\` from the boss fight`
                  );

                    resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));


          }
          if (reward === "3c") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("3c");
            var commoncardarray = [];
            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Common"
            })
              .then(result => {
                result.forEach((item, i) => {
                  commoncardarray.push(item);
                });

                finalcommoncard =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 cardc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(cardc);

                finalcommoncard1 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard1[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card1);

                finalcommoncard2 =
                  commoncardarray[
                    Math.floor(Math.random() * commoncardarray.length)
                  ];
                 card2 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finalcommoncard2[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(card2);

                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `\n <@${itemone.cardowner}> won \`\`${cardc.cardname} - (${
                      cardc.cardtype
                    }) - ${cardc.element}\`\` \`\`${card1.cardname} - (${
                      card1.cardtype
                    }) - ${card1.element}\`\` \`\`${card2.cardname} - (${
                      card2.cardtype
                    }) - ${card2.element}\`\` from the boss fight`
                  );

                    resultEmbed.addField(`Rewards`, winmsg)

              })
              .catch(err => console.log(err));


          }
          if (reward === "1uc") {
            var cardc = []
            var cardcc = []
            var card1 =[]
            var card2 = []
            var carduc = []
            var carduc1 = []
            var carduc2 = []
            var cardr = []
            var cardr1 = []
            var cardr1 = []
            var uncommoncardarray = [];
            var commoncardarray = [];
               var winmsg = []
            console.log("1uc");

            // THIS CODE  ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
            Addcard.find({
              cardtype: "Uncommon"
            })
              .then(result => {
                result.forEach((item, i) => {
                  uncommoncardarray.push(item);
                });

                finaluncommoncard =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc);
                finaluncommoncard1 =
                  uncommoncardarray[
                    Math.floor(Math.random() * uncommoncardarray.length)
                  ];
                 carduc1 = [
                  "cardname",
                  "cardtype",
                  "cardscore",
                  "element",
                  "strength",
                  "endurance",
                  "vitality",
                  "leadership",
                  "intellect",
                  "series",
                  "imgurl"
                ].reduce(
                  (carry, key) => {
                    carry[key] = finaluncommoncard[key];
                    return carry;
                  },
                  {
                    upgrade: 0,
                    cardid: Math.random()
                      .toString(20)
                      .substr(2, 6)
                  }
                );
                // THIS CODE ^ ADDS THE CARD TO THE USER ------------------------------------------------------------------------------------------------------------------------------------------------------------------
                thisistheguy.cardstats.push(carduc1);
                console.log(`card stats ${thisistheguy.cardstats}`);
                console.log(`BEfore Saving ${carduc}`);
                thisistheguy
                  .save()
                  .then(done => console.log(`card saved`))
                  .catch(err => console.log(err));
                  winmsg.push(
                    `<@${itemone.cardowner}> won \`\`${carduc.cardname} - (${
                      carduc.cardtype
                    }) - ${carduc.element}\`\` from the boss fight `
                  );
                  resultEmbed.addField(`Rewards`, winmsg)
              })
              .catch(err => console.log(err));






          }
        }



      }



// const resultEmbed = new Discord.MessageEmbed().setTitle('Boss fight results');
// resultEmbed.addField(`Rewards`, winmsg)
// message.channel.send(resultEmbed)
return
    }
    var defeat = 1

    const finalEmbed = new Discord.MessageEmbed().setTitle('Boss fight results');
    finalEmbed.addField(`Result :`, `***Oh no! Players were unable to defeat the raid boss. Better luck next time !***`)

  });


  // strengthtotal = strengthtotal + itemit.strength
  // endurancetotal = endurancetotal + itemit.endurance
  // vitalitytotal = vitalitytotal + itemit.endurance
  // leadershiptotal = leadershiptotal + itemit.endurance
  // intellecttotal = intellecttotal + itemit.endurance
};

exports.help = {
  name: "boss"
};
