import { createLogger } from '@lvksh/logger';
import chalk from 'chalk';
import { Client, Intents } from "discord.js";
import fs from 'fs';
function getRandomInt() {
  return Math.ceil(Math.random() * (123))
}
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
if (fs.existsSync('./configuration.json')) {
  log.ok("Configuration file exists.")
  var config = require('../configuration.json')
}
else {
  log.veryBigError("The configuration file does not exist. Please rename configuration.example.json to configuration.json and add your token.")
  process.exit(1)
}

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("ready", () => {
  log.ok("Welcome to Foxbot")
  log.info("Running version "+require('../package.json').version)
  log.ok("Logged in as "+ client.user?.tag)
});

client.on("messageCreate", (message:any) => {
  if (message.content == "pic") {
    log.info(message.author.username+"#"+message.author.discriminator+" requested 1 random image.")
    message.channel.send("https://randomfox.ca/?i="+getRandomInt());
  }
  if (message.content == "picbomb") {
    log.info(message.author.username+"#"+message.author.discriminator+" requested 5 random images.")
    var stringtosend:string = "https://randomfox.ca/?i="+getRandomInt()+"\n"
    for (let i = 0; i < 4; i++) {
      stringtosend += "https://randomfox.ca/?i="+getRandomInt()+"\n";
    }
    message.channel.send(stringtosend);
  }
});

process.on('SIGINT', function() {
  log.info("Recieved kill signal...killing.");
  client.destroy();
  process.exit(0);
});

if (typeof config.discord_token !== 'string') throw new Error('Discord token is not a string');

client.login(config.discord_token);
