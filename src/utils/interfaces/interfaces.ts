import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, InteractionResponse } from 'discord.js';

export interface Command {
    guildOnly?: boolean;
    register_command: SlashCommandBuilder;
    execute: (client: Client, interaction: CommandInteraction) => Promise<InteractionResponse<boolean>>;
}

export interface Event {
    type: 'on' | 'once';
    event: string;
    call: (client: Client, ...args: any[]) => void;
}