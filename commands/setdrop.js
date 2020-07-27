
const Discord = require('discord.js');


const mongoose = require("mongoose");
const Addcard = require("../models/addcard.js")
const Report = require("../models/report.js")
const Channel = require("../models/dropchannel.js")

exports.run = async (client,message,args) => {
const setChannel = await new Channel({
    _id: mongoose.Types.ObjectId(),
    channel: args[0]
})
setChannel.save();
message.channel.send(`${args[0]} is set for Drops.`)
};

exports.help = {
  name: 'setdrop'
};
