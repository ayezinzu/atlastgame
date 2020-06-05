const { Client, MessageAttachment } = require('discord.js');
exports.run = (client,message,args) => {
message.channel.send("testmsg").catch(console.error);
  };

  exports.help = {
    name: 'lol'
  };
