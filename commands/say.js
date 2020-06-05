exports.run = (client,message,args) => {
  client.on('message', function(message) {
      // Now, you can use the message variable inside


              // use the message's channel (TextChannel) to send a new message
              message.channel.send("123")
              .catch(console.error); // add error handling here
        

  });
};

exports.help = {
  name: 'say'
};
