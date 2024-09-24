import { Client, CommandInteraction } from 'discord.js';

export interface Command {
    guildOnly?: boolean;
    register_command: any;
    execute: (client: Client, interaction: CommandInteraction) => Promise<void>;
}

declare module 'discord.js' {
    interface Client {
        commands: Record<string, Command>;
    }
}
