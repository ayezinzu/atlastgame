const Canvas = require('canvas');
const Discord = require('discord.js');


const mongoose = require("mongoose");
const Addcard = require("../models/addcard.js")
const Report = require("../models/report.js")
const Pagination = require('discord-paginationembed');
var chunk = require('lodash.chunk');
var _ = require('lodash');
exports.run = async (client,message,args) => {
  setInterval( () => {
    message.channel.send("hi")
  }, 1000)


};

exports.help = {
  name: 'fun'
};
