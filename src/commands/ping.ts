import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

import { SlashCommand } from '../types/SlashCommand';

export const PingCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!')
        .toJSON(),
    run: async (interaction: CommandInteraction) => {
        await interaction.reply({
            content: 'Pong!',
        });

        return true;
    },
};
