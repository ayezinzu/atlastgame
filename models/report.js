const mongoose = require("mongoose");

const statsSchema = mongoose.Schema({
  cardname: String,
  cardid: String,
  upgrade: Number,
  cardtype: String,
  cardscore: Number,
  imgurl: String,
  strength: Number,
  leadership: Number,
  element: String,
  vitality: Number,
  endurance: Number,
  intellect: Number,
  series: String,
  imgurl: String,




},{ strict: false })

const reportSchema = mongoose.Schema({

  username: String,
  userid: String,
  dust: Number,
  cardstats: [statsSchema]

},{ strict: false });

module.exports = mongoose.model("Report", reportSchema);
