function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}
import { createLogger } from '@lvksh/logger';
const chalk = require('chalk')
var config = require('./config.json');
const log = createLogger(
  {
      ok: {
          label: chalk.greenBright`[OK]`,
          newLine: '| ',
          newLineEnd: '\\-',
      },
      debug: chalk.magentaBright`[DEBUG]`,
      info: {
          label: chalk.cyan`[INFO]`,
          newLine: chalk.cyan`⮡`,
          newLineEnd: chalk.cyan`⮡`,
      },
      veryBigError: chalk.bgRed.white.bold`[ERROR]`
  },
  { padding: 'PREPEND' },
  console.log
);

const fs = require('fs');
if (fs.existsSync('config.json')) {
  log.ok("Config file exists.")
}
else {
  log.veryBigError("The config file does not exist. Please rename config.example.json to config.json and add your token.")
  process.exit(1)
}

const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("ready", () => {
  log.ok("Welcome to Foxbot")
  log.info("Running version 1.0.0")
  log.ok("Logged in as "+ client.user.tag)
});

client.on("messageCreate", (message:any) => {
  if (message.content == "pic") {
    log.info(message.author.username+"#"+message.author.discriminator+" requested 1 random image.")
    message.channel.send("https://randomfox.ca/?i="+getRandomInt(123));
  }
  if (message.content == "picbomb") {
    log.info(message.author.username+"#"+message.author.discriminator+" requested 5 random images.")
    var stringtosend:string = "https://randomfox.ca/?i="+getRandomInt(123)+"\n"
    for (let i = 0; i < 4; i++) {
      stringtosend += "https://randomfox.ca/?i="+getRandomInt(123)+"\n";
    }
    message.channel.send(stringtosend);
  }
});

process.on('SIGINT', function() {
  log.info("Recieved kill signal...killing.");
  client.destroy();
  process.exit(0);
});

// Uptime Kuma stuff
setInterval(function(){
  const http = require("https");

  const options = {
    "method": "GET",
    "hostname": "uptime.jontes.page",
    "path": "/api/push/jhKmrbnqwv?=&status=up&msg=OK&ping=",
  };
  
  const req = http.request(options, function () {
    log.debug("Reported uptime to Uptime Kuma")
  });
  
  req.end();
},600000)

client.login(config.discord_token);