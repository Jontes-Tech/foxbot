import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import { SlashCommands } from '../slashHandler';
import { log } from './logger';

export const deploySlash = async (
    guildId: string,
    clientId: string,
    token: string
): Promise<boolean> => {
    const commandData = SlashCommands.map((command) => command.data);

    const rest = new REST({ version: '9' }).setToken(token);

    try {
        log.debug('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commandData,
        });

        log.debug('Successfully reloaded application (/) commands.');
    } catch (error) {
        log.error('Error deploying...', error as any);

        return false;
    }

    return true;
};
