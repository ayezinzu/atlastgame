const Canvas = require("canvas");
const Discord = require("discord.js");
const util = require("util");
const mongoose = require("mongoose");
const Addcard = require("../models/addcard.js");
const Addboss = require("../models/addboss.js");
const Report = require("../models/report.js");
const Pagination = require("discord-paginationembed");
let chunk = require("lodash.chunk");
let _ = require("lodash");
const Channel = require("../models/raidchannel.js");
exports.run = async (client, message, args) => {
  if(!message.member.permissions(`ADMINSTRATOR`)) return message.channel.send(`You don't have perms to do so.`);
  setInterval(() => {

  setTimeout(() => {
    message.channel.send(`\`\`Prepare yourselves! A raid is set to begin in 5 minutes!\`\``)
  }, 300000)
  let cardsarray = []; // this will contain cards of the participants
  let participants = []; // array of participants
  class Input {
    constructor(
      cardsarray,
      participants,
      bosscardname,
      bossdifficulty,
      bosselement,
      bossstrength,
      bossvitality,
      bossendurance,
      bossleadership,
      bossintellect,
      thistheguy,
      enteredname,
      enteredcardtype,
      enteredcardelement
    ) {
      this.cardsarray = cardsarray;
      this.participants = participants;
      this.bosscardname = bosscardname;
      this.bossdifficulty = bossdifficulty;
      this.bosselement = bosselement;
      this.bossstrength = bossstrength;
      this.bossvitality = bossvitality;
      this.bossendurance = bossendurance;
      this.bossleadership = bossleadership;
      this.bossintellect = bossintellect;
      this.thistheguy = thistheguy;
      this.enteredname = enteredname;
      this.enteredcardtype = enteredcardtype;
      this.enteredcardelement = enteredcardelement;
    }
  }

  const addbosscount = await Addboss.countDocuments().exec(); // counting boss cards

  // Get a random entry
  var random12 = Math.floor(Math.random() * addbosscount);
  console.log(`random12`, random12);
  // Again query all users but only fetch one offset by our random #
  const bosscard = await Addboss.findOne().skip(random12).exec(); // getting random boss cards
  bossimg = new Discord.MessageAttachment(`${bosscard.imgurl}`);
  let bosscardname = bosscard.cardname;
  let bossdifficulty = bosscard.difficulty;
  let bosselement = bosscard.element;
  let bossstrength = parseInt(bosscard.strength);
  let bossvitality = parseInt(bosscard.vitality);
  let bossendurance = parseInt(bosscard.endurance);
  let bossleadership = parseInt(bosscard.leadership);
  let bossintellect = parseInt(bosscard.intellect);
  // setting up vars
  await message.channel.send(`\`\`A Raid Boss Has Spawned\`\``, bossimg);
  await message.channel.send(
    `\`\`${bosscard.cardname} (Level-${bosscard.difficulty}) - ${bosscard.element}\`\``
  );
  await message.channel.send(
    `Enter \`\`CARDID\`\` to enter a card in the battle !`
  );
  await message.channel.send(`\n Battle Starts in 30 seconds!`);
  const filter = (m) => m.content;
  const collector = message.channel.createMessageCollector(filter, {
    time: 5000,
  });
  // sending initiative messages
  let thistheguy;
  let enteredname;
  let enteredcardtype;
  let enteredcardelement;
  collector.on("collect", async (m) => {
    if (m.author.bot) return;
    if (participants.includes(m.author.id)) {
      message.channel.send(
        `\`\`You have already sent a fighter into this battle!\`\``
      );
      return;
    }
    let poggers = 0;
    thistheguy = await Report.findOne({
      userid: m.author.id,
    });
    for (i = 0; i < thistheguy.cardstats.length; i++) {
      const item = thistheguy.cardstats[i];
      if (m.content === item.cardid) {
        participants.push(m.author.id);
        enteredname = item.cardname;
        enteredcardtype = item.cardtype;
        enteredcardelement = item.element;
        cardsarray.push({
          cardid: m.content,
          cardowner: m.author.id,
        });
        message.channel.send(
          `<@${m.author.id}> entered \`\`${enteredname} (${enteredcardtype}) - (${enteredcardelement})\`\` into the battle !`
        );
        poggers = 1;
        break;
      } else {
        poggers = 0;
      }
    }
    if (poggers === 0) {
      message.channel.send(`Error : Card not found`);
    }
  });
  collector.on("end", async (collected) => {
    const wait = util.promisify(setTimeout);
    let totalstrength = 0;
    let totalvitality = 0;
    let totalendurance = 0;
    let totalleadership = 0;
    let totalintellect = 0;
    let elementarray = [];
    let cardnamearray = [];
    let cardtypearray = [];
    let cardelementarray = [];
    let newInput = new Input(
      cardsarray,
      participants,
      bosscardname,
      bossdifficulty,
      bosselement,
      bossstrength,
      bossvitality,
      bossendurance,
      bossleadership,
      bossintellect,
      thistheguy,
      enteredname,
      enteredcardtype,
      enteredcardelement
    );

    if (newInput.cardsarray.length < 1) {
      message.channel.send(
        "**Oh no! Looks like the boss has escaped before our heroes could get there!**"
      );
      return;
    }

    message.channel.send(`**Battle commenced !**`);

    class Calculations {
      constructor(
        totalstrength,
        totalvitality,
        totalendurance,
        totalleadership,
        totalintellect,
        elementarray,
        cardnamearray,
        cardtypearray,
        cardelementarray
      ) {
        this.totalstrength = totalstrength;
        this.totalvitality = totalvitality;
        this.totalendurance = totalendurance;
        this.totalleadership = totalleadership;
        this.totalintellect = totalintellect;
        this.elementarray = elementarray;
        this.cardnamearray = cardnamearray;
        this.cardtypearray = cardtypearray;
        this.cardelementarray = cardelementarray;
      }
    }

    for (itemone of newInput.cardsarray) {
      let thisisthecard = itemone.cardid;
      let thisistheguy = await Report.findOne({
        userid: itemone.cardowner,
      });
      for (item of thisistheguy.cardstats) {
        if (item.cardid === thisisthecard) {
          cardnamearray.push(item.cardname);
          cardtypearray.push(item.cardtype);
          cardelementarray.push(item.element);
          totalstrength += parseInt(item.strength);
          totalvitality += parseInt(item.vitality);
          totalendurance += parseInt(item.endurance);
          totalleadership += parseInt(item.leadership);
          totalintellect += parseInt(item.intellect);
          elementarray.push(item.element);
        }
      }
    }

    newCalculations = new Calculations(
      totalstrength,
      totalvitality,
      totalendurance,
      totalleadership,
      totalintellect,
      elementarray,
      cardnamearray,
      cardtypearray,
      cardelementarray
    );
    let randomcard;
    function sendRandomSlur(cardnamearray) {
      randomcard =
        cardnamearray[Math.floor(Math.random() * cardnamearray.length)];
      let slursarry = [
        `\`\`${randomcard}\`\` took a heavy hit! Ouch!`,
        `\`\`${randomcard}\`\` is leading the battle!`,
        `\`\`${randomcard}\`\` isn't giving up!`,
        `\`\`${newInput.bosscardname}\`\` deals a massive blow to \`\`${randomcard}\`\`. That's going to hurt.`,
        `The raid party is working well together!`,
        `\`\`${randomcard}\`\` slips and falls over. Whoops!`,
        `\`\`${newInput.bosscardname}\`\` prepares an attack! Look out!`,
        `\`\`${newInput.bosscardname}\`\` is defending!`,
        `\`\`${randomcard}\`\` missed their attack!`,
        `\`\`${randomcard}\`\` is defending!`,
        `That attack landed \`\`${randomcard}\`\`! Nice one!`,
        `\`\`${newInput.bosscardname}\`\` is changing position!`,
        `\`\`${randomcard}\`\` strikes!`,
        `Who needs a plan when you got \`\`${randomcard}\`\`?!`,
        `\`\`${newInput.bosscardname}\`\` stands their ground.`,
        `\`\`${randomcard}\`\` made a mistake. Sorry!`,
        `A glancing blow \`\`${randomcard}\`\`!`,
        `Need some help? \`\`${randomcard}\`\` is here!`,
        `\`\`${randomcard}\`\` is eager to get this over with.`,
        `Oh no! \`\`${newInput.bosscardname}\`\` is powering up!`,
        `Never gonna give \`\`${randomcard}\`\` up!`,
        `\`\`${randomcard}\`\` is giving it all they got!`,
        `\`\`${randomcard}\`\` takes guard against \`\`${newInput.bosscardname}\`\``,
        `\`\`${randomcard}\`\` attempts to lead the next attack!`,
        `Who needs a plan when you got \`\`${randomcard}\`\` ?!`,
        `\`\`${randomcard}\`\` gets tripped up trying to dodge an attack. Be careful!`,
      ];

      randomslur1 = slursarry[Math.floor(Math.random() * slursarry.length)];
      message.channel.send(randomslur1);
    }
    console.log([Math.floor(Math.random() * cardnamearray.length)]);
    sendRandomSlur(newCalculations.cardnamearray);

    await wait(4000);
    sendRandomSlur(newCalculations.cardnamearray);
    await wait(2000);
    sendRandomSlur(newCalculations.cardnamearray);
    await wait(500);
    sendRandomSlur(newCalculations.cardnamearray);
    await wait(4000);
    sendRandomSlur(newCalculations.cardnamearray);
    await wait(2000);
    sendRandomSlur(newCalculations.cardnamearray);
    await wait(500);
    sendRandomSlur(newCalculations.cardnamearray);
    await wait(4000);
    sendRandomSlur(newCalculations.cardnamearray);
    await wait(2000);
    sendRandomSlur(newCalculations.cardnamearray);

    let winchance;
    if (
      newCalculations.totalstrength < newInput.bossstrength &&
      newCalculations.totalvitality < newInput.bossvitality &&
      newCalculations.totalendurance < newInput.bossendurance &&
      newCalculations.totalleadership < newInput.bossleadership &&
      newCalculations.totalintellect < newInput.bossintellect
    ) {
      winchance = 80;
    } else {
      winchance = 30;
    }
    class Elements {
      constructor(
        lightn,
        darkn,
        earthn,
        watern,
        firen,
        airn,
        dualn,
        winchance
      ) {
        this.lightn = lightn;
        this.darkn = darkn;
        this.earthn = earthn;
        this.watern = watern;
        this.firen = firen;
        this.airn = airn;
        this.dualn = dualn;
        this.winchance = winchance;
      }
    }

    let lightn = 0;
    let darkn = 0;
    let earthn = 0;
    let watern = 0;
    let firen = 0;
    let airn = 0;
    let dualn = 0;

    let newElements = new Elements(
      lightn,
      darkn,
      earthn,
      watern,
      firen,
      airn,
      dualn,
      winchance
    );
    newCalculations.elementarray.forEach((x) => x == "Light" && lightn++);
    newCalculations.elementarray.forEach((x) => x == "Dark" && darkn++);
    newCalculations.elementarray.forEach((x) => x == "Earth" && earthn++);
    newCalculations.elementarray.forEach((x) => x == "Fire" && firen++);
    newCalculations.elementarray.forEach((x) => x == "Air" && airn++);
    newCalculations.elementarray.forEach((x) => x == "Dual" && dualn++);

    if (newInput.bosselement === "Water") {
      newElements.winchance = newElements.winchance + newElements.airn * 5;
    }
    if (newInput.bosselement === "Fire") {
      newElements.winchance = newElements.winchance + newElements.watern * 5;
    }
    if (newInput.bosselement === "Earth") {
      newElements.winchance = newElements.winchance + newElements.firen * 5;
    }
    if (newInput.bosselement === "Air") {
      newElements.winchance = newElements.winchance + newElements.earthn * 5;
    }

    let winCalculator = Math.random() * 100;

    if (winCalculator < winchance) {
      const rewardsEmbed = new Discord.MessageEmbed().setTitle(
        "Amazing fight warriors, you did it!"
      );
      console.log("we in");

      // qq

      //SELECTING REWARDS FUNCTION
      let rewardsArray = [];
      let theReward;
      let typeOfRewardCard;
      let times;
      let winmsg = [];
      async function giveDust(addDust, rewardHim) {
        rewardHim.dust = rewardHim.dust + addDust;
        await rewardHim.save();

        console.log("ok done");

        winmsg.push(
          `<@${rewardHim.userid}> won \`\`${addDust} dust\`\` from the boss fight `
        );
        console.log(winmsg, `inside dust function`);
        rewardsEmbed.addField(` ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎`, winmsg);
        winmsg = [];
      }
      async function giveReward(typeOfRewardCard, rewardHim) {
        const result = await Addcard.find({
          cardtype: `${typeOfRewardCard}`,
        });

        finalcard = result[Math.floor(Math.random() * result.length)];

        card = [
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
          "imgurl",
        ].reduce(
          (carry, key) => {
            carry[key] = finalcard[key];
            return carry;
          },
          {
            upgrade: 0,
            cardid: Math.random().toString(20).substr(2, 6),
          }
        );
        rewardHim.cardstats.push(card);
        await rewardHim.save();
        console.log("ok check now.");
        winmsg.push(
          `<@${rewardHim.userid}> won \`\`${card.cardname} - (${card.cardtype}) - ${card.element}\`\` from the boss fight `
        );
        rewardsEmbed.addField(` ‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎‏‏‎`, winmsg);
        console.log(winmsg, `inside function`);
        winmsg = [];
      }
      const giveRewardFunction = util.promisify(giveReward);
      const giveDustFunction = util.promisify(giveDust);
      for (itemone of newInput.cardsarray) {
        let rewardThisGuy = await Report.findOne({
          userid: itemone.cardowner,
        });
        if (bossdifficulty === 1) {
          console.log(itemone.cardowner, `here is lvl1`);
          rewardsArray = [1, 2, 3, 11, 22];
          theReward =
            rewardsArray[Math.floor(Math.random() * rewardsArray.length)];
          console.log(theReward, `the reward`);
          if (theReward === 1 || theReward === 2 || theReward === 3) {
            console.log(theReward, `the reward to ${rewardThisGuy.userid}`);
            await giveDust(theReward, rewardThisGuy);
          } else if (theReward === 11) {
            console.log(theReward, `the reward to ${rewardThisGuy.userid}`);
            times = 1;
            typeOfRewardCard = "Common";
          } else if (theReward === 22) {
            console.log(theReward, `the reward to ${rewardThisGuy.userid}`);
            times = 2;
            typeOfRewardCard = "Common";
          }
        }
        if (bossdifficulty === 2) {
          rewardsArray = [1, 2, 3, 4, 11, 22, 33, 111];
          theReward =
            rewardsArray[Math.floor(Math.random() * rewardsArray.length)];
          console.log(theReward, `the reward`);
          if (
            theReward === 2 ||
            theReward === 3 ||
            theReward === 4 ||
            theReward === 1
          ) {
            console.log(theReward, `the reward to ${rewardThisGuy}`);
            await giveDust(theReward, rewardThisGuy);
          } else if (theReward === 11) {
            console.log(theReward, `the reward to ${rewardThisGuy}`);
            times = 1;
            typeOfRewardCard = "Common";
          } else if (theReward === 22) {
            console.log(theReward, `the reward to ${rewardThisGuy}`);
            times = 2;
            typeOfRewardCard = "Common";
          } else if (theReward === 33) {
            console.log(theReward, `the reward to ${rewardThisGuy}`);
            times = 3;
            typeOfRewardCard = "Common";
          } else if (theReward === 111) {
            console.log(theReward, `the reward to ${rewardThisGuy}`);
            times = 1;
            typeOfRewardCard = "Uncommon";
          }
        }
        if (bossdifficulty === 3) {
          rewardsArray = [2, 3, 4, 22, 33, 111, 222];
          theReward =
            rewardsArray[Math.floor(Math.random() * rewardsArray.length)];
          console.log(theReward, `the reward`);
          if (theReward === 2 || theReward === 3 || theReward === 4) {
            await giveDust(theReward, rewardThisGuy);
          } else if (theReward === 22) {
            times = 2;
            typeOfRewardCard = "Common";
          } else if (theReward === 33) {
            times = 3;
            typeOfRewardCard = "Common";
          } else if (theReward === 111) {
            times = 1;
            typeOfRewardCard = "Uncommon";
          } else if (theReward === 222) {
            times = 2;
            typeOfRewardCard = "Uncommon";
          }
        }
        if (bossdifficulty === 4) {
          rewardsArray = [3, 4, 5, 111, 222, 333, 1111];
          theReward =
            rewardsArray[Math.floor(Math.random() * rewardsArray.length)];
          console.log(theReward, `the reward`);
          if (theReward === 3 || theReward === 4 || theReward === 5) {
            await giveDust(theReward, rewardThisGuy);
          } else if (theReward === 111) {
            times = 1;
            typeOfRewardCard = "Uncommon";
          } else if (theReward === 222) {
            times = 2;
            typeOfRewardCard = "Uncommon";
          } else if (theReward === 333) {
            times = 3;
            typeOfRewardCard = "Uncommon";
          } else if (theReward === 1111) {
            times = 1;
            typeOfRewardCard = "Rare";
          }
        }
        if (bossdifficulty === 5) {
          rewardsArray = [4, 5, 6, 7, 1111, 2222, 11111];
          theReward =
            rewardsArray[Math.floor(Math.random() * rewardsArray.length)];
          console.log(theReward, `the reward`);
          if (
            theReward === 4 ||
            theReward === 5 ||
            theReward === 6 ||
            theReward === 7
          ) {
            await giveDust(theReward, rewardThisGuy);
          } else if (theReward === 1111) {
            times = 1;
            typeOfRewardCard = "Rare";
          } else if (theReward === 2222) {
            times = 2;
            typeOfRewardCard = "Rare";
          } else if (theReward === 11111) {
            times = 1;
            typeOfRewardCard = "Epic";
          }
        }
        if (times === 1) {
          await giveReward(typeOfRewardCard, rewardThisGuy);
          console.log(winmsg);
        }
        if (times === 2) {
          await giveReward(typeOfRewardCard, rewardThisGuy);

          await giveReward(typeOfRewardCard, rewardThisGuy);
          console.log(winmsg);
        }
        if (times === 3) {
          await giveReward(typeOfRewardCard, rewardThisGuy);

          await giveReward(typeOfRewardCard, rewardThisGuy);

          await giveReward(typeOfRewardCard, rewardThisGuy);
          console.log(winmsg);
        }
      }
      console.log(winmsg, `before adding`);
      rewardsEmbed.setThumbnail(
        `https://cdn.discordapp.com/attachments/755043428550574120/755293921847804007/cup.png`
      );
      rewardsEmbed.setColor(`#00FF00`);
      message.channel.send(rewardsEmbed);

      console.log(`ok everything`);
    } else {
      const lossEmbed = new Discord.MessageEmbed().setTitle(
        "Rest in peace our beloved warriors."
      );
      lossEmbed.setImage(
        `https://cdn.discordapp.com/attachments/718036708435689494/755285630308581406/funeral.png`
      );
      lossEmbed.setColor(`#FF0000`);

      message.channel.send(lossEmbed);
    }
  });
}, 14100000)
};
exports.help = {
  name: "boss",
};
