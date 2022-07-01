import { Interaction } from 'discord.js';

import { PicCommand } from './commands/pic';
import { PicBombyCommand } from './commands/picbomb';
import { PingCommand } from './commands/ping';
import { SlashCommand } from './types/SlashCommand';

export const SlashCommands: SlashCommand[] = [
    PingCommand,
    PicCommand,
    PicBombyCommand,
];

export const handleSlash = (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    for (const slashCommand of SlashCommands) {
        if (slashCommand.data.name === interaction.commandName) {
            slashCommand.run(interaction);
        }
    }
};
