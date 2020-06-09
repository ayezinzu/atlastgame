const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0-hlj9n.mongodb.net/atlas?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

const reportSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cardname: String,
  cardtype: String,
  cardscore: String,
  imgurl: String,
  strength: String,
  leadership: String,
  element: String,
  vitality: String,
  endurance: String,
  emoji : String,
  series : String
});

module.exports = mongoose.model("Addcard", reportSchema);
