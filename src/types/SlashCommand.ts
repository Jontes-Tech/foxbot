import { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';

export type SlashCommand = {
    data: RESTPostAPIApplicationCommandsJSONBody;
    run: (interaction: CommandInteraction) => Promise<boolean>;
    autoComplete?: (interaction: AutocompleteInteraction) => Promise<boolean>;
};
