
 const mongoose = require("mongoose");
 const Addcard = require("../models/addcard.js");
exports.run = async (client,message,args) => {
  let commoncardarray = []
  const result = await Addcard.find({
    cardtype: "Common"
  })
  result.forEach((item, i) => {
    commoncardarray.push(item);
  });
  finalcommoncard =
  result[
    5
  ]
  finalcommoncard1 =
  commoncardarray[
    5
  ]
  console.log(finalcommoncard)
  console.log(finalcommoncard1)
};

exports.help = {
  name: 'test'
};
