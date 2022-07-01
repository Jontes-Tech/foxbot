import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

import { SlashCommand } from '../types/SlashCommand';
import { log } from '../util/logger';

function getRandomInt() {
    return Math.ceil(Math.random() * 123);
}

export const PicBombyCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('picbomb')
        .setDescription('Replies with 5 fox images!')
        .toJSON(),
    run: async (interaction: CommandInteraction) => {
        await interaction.reply({
            content: [...Array.from({ length: 5 })]
                .map((_, index) => `https://randomfox.ca/?i=${getRandomInt()}`)
                .join('\n'),
        });
        const { user, guild } = interaction;

        log.info(
            `${user.username}#${user.discriminator} requested 5 random images in ${guild?.name}`
        );

        return true;
    },
};
