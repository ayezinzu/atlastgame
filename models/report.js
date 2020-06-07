const mongoose = require("mongoose");

const statsSchema = mongoose.Schema({
  cardname: String,
  cardtype: String,
  cardscore: String,
  imgurl: String,
  strength: String,
  leadership: String,
  element: String,
  vitality: String,
  endurance: String


})

const reportSchema = mongoose.Schema({
  
  username: String,
  userid: String,
  cardstats: [statsSchema]

});

module.exports = mongoose.model("Report", reportSchema);
