

const Discord = require('discord.js');
const { Client, MessageAttachment } = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');
const client = new Discord.Client();
require('dotenv-flow').config();
const mongoose = require("mongoose");


const config = {
    token: process.env.TOKEN,
    // owner: process.env.OWNER,
    prefix: process.env.PREFIX
};

const prefix = config.prefix;

client.commands = new Enmap();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// [!!mute @User 12h Posting too many good memes]
// 0        1     2      3     5   6    7   8
// !!mute <user> <time> <reason> \

client.on('message', message => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    if (!cmd) return;

    cmd.run(client, message, args);



});

fs.readdir('./commands/', async (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
      if (!file.endsWith('.js')) return;
      let props = require(`./commands/${file}`);
      let cmdName = file.split('.')[0];
      console.log(`Loaded command '${cmdName}'`);
      client.commands.set(cmdName, props);
    });
  });

client.login(process.env.TOKEN);
