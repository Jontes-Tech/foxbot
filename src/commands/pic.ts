import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

import { SlashCommand } from '../types/SlashCommand';
import { log } from '../util/logger';

function getRandomInt() {
    return Math.ceil(Math.random() * 123);
}

export const PicCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('pic')
        .setDescription('Replies with fox image!')
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setMinValue(1)
                .setMaxValue(5)
                .setDescription('How many pictures do you want?')
        )
        .toJSON(),
    run: async (interaction: CommandInteraction) => {
        const amount = interaction.options.getInteger('amount') ?? 1;

        await interaction.reply({
            content: [...Array.from({ length: amount })]
                .map((_, index) => `https://randomfox.ca/?i=${getRandomInt()}`)
                .join('\n'),
        });
        const { user, guild } = interaction;

        log.info(
            `${user.username}#${
                user.discriminator
            } requested ${amount} random ${amount === 1 ? 's' : ''} in ${
                guild?.name
            }`
        );

        return true;
    },
};
