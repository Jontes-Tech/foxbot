function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}
import { createLogger } from '@lvksh/logger';
import chalk from 'chalk';
var config = require('./config.json');
const log = createLogger(
  {
      ok: {
          label: chalk.greenBright`[OK]`,
          newLine: '| ',
          newLineEnd: '\\-',
      },
      info: {
          label: chalk.cyan`[INFO]`,
          newLine: chalk.cyan`⮡`,
          newLineEnd: chalk.cyan`⮡`,
      }
  },
  { padding: 'PREPEND' },
  console.log
);

const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("ready", () => {
  console.log()
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
});

client.login(config.discord_token);