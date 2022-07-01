/* eslint-disable sonarjs/cognitive-complexity */
import { Client, DMChannel, Intents } from 'discord.js';
import fs from 'node:fs';

import { handleSlash } from './slashHandler';
import { deploySlash } from './util/deploy';
import { log } from './util/logger';
function getRandomInt() {
    return Math.ceil(Math.random() * 123);
}

if (!fs.existsSync('./configuration.json')) {
    log.error(
        'The configuration file does not exist. Please rename configuration.example.json to configuration.json and add your token.'
    );

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
}

log.ok('Configuration file exists.');
const config = require('../configuration.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES,
    ],
    partials: ['CHANNEL'],
});

client.on('ready', () => {
    log.ok('Welcome to Foxbot');

    if (fs.existsSync('./package.json')) {
        log.info('Running version ' + require('../package.json').version);
    }

    log.ok('Logged in as ' + client.user?.tag);
});

client.on('debug', (debug_info) => {
    if (config.debug) {
        log.debug(debug_info);
    }
});

client.on('messageCreate', async (message) => {
    let { channel } = message;
    const { content, author, guild } = message;

    if (channel.partial) channel = await channel.fetch();

    if (content == '$pic') {
        log.info(
            `${author.username}#${
                author.discriminator
            } requested 1 random image in ${
                channel instanceof DMChannel ? 'DMs' : guild?.name
            }`
        );
        // eslint-disable-next-line sonarjs/no-duplicate-string
        await channel.send('https://randomfox.ca/?i=' + getRandomInt());

        return;
    }

    if (content == '$picbomb') {
        let stringtosend: string =
            'https://randomfox.ca/?i=' + getRandomInt() + '\n';

        for (let index = 0; index < 4; index++) {
            stringtosend += 'https://randomfox.ca/?i=' + getRandomInt() + '\n';
        }
        await channel.send(stringtosend);

        return;
    }

    if (content === '$deploy') {
        if (!guild) {
            await channel.send({
                content: 'This command only works in guilds.',
            });

            return;
        }

        if (!client.user) return;

        const result = await deploySlash(
            guild.id,
            client.user.id,
            config.discord_token
        );

        if (!result) {
            await channel.send({
                content:
                    'Bot does not have appropriate permission, reinvite bot with `application.commands` scope... 🤬',
            });

            return;
        }

        await channel.send({
            content: 'Commands deployed! 🚀',
        });

        return;
    }

    if (channel instanceof DMChannel) {
        if (author.bot) return;

        await channel.send({
            content:
                // eslint-disable-next-line quotes
                "Sorry... I don't quite understand this...Yeah...But maybe you misspelled or something? Below is a list of avaible commands: \n```$pic - sends 1 foxpic.\n$picbomb - sends 5 foxpics.```",
        });
    }
});

client.on('interactionCreate', handleSlash);

process.on('SIGINT', () => {
    log.info('Recieved kill signal...killing.');
    client.destroy();
    process.exit(0);
});

if (typeof config.discord_token !== 'string')
    throw new Error('Discord token is not a string');

client.login(config.discord_token);
