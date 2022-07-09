// Notes:
// - The debug "bool" is not really a bool, since it's a string. I'm too lazy to fix it.

/* eslint-disable sonarjs/cognitive-complexity */
import { Client, DMChannel, Intents } from 'discord.js';
import fs from 'node:fs';

import { handleSlash } from './slashHandler';
import { deploySlash } from './util/deploy';
import { log } from './util/logger';
function getRandomInt() {
    return Math.ceil(Math.random() * 123);
}

if (process.env.foxbot_discord_token == undefined) {
    log.error(
        'Please specify the env var foxbot_discord_token as your Discord token.'
    );
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
}

const discord_token: string = process.env.foxbot_discord_token;

log.ok('The correct env vars exist.');

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
    if (process.env.foxbot_debug == 'true') {
        log.debug(debug_info);
    }
});

client.on('messageCreate', async (message) => {
    let { channel } = message;
    const { content, author, guild } = message;

    if (channel.partial) channel = await channel.fetch();

    if (content.toLowerCase()  == '$pic') {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        await channel.send('https://randomfox.ca/?i=' + getRandomInt());

        return;
    }

    if (content.toLowerCase() == '$picbomb') {
        log.info(
            `${author.username}#${
                author.discriminator
            } requested 5 random images in ${
                channel instanceof DMChannel ? 'DMs' : guild?.name
            }`
        );
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
            discord_token
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

client.login(discord_token);
