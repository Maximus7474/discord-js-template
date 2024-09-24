import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import { Command } from '../utils/interfaces/interfaces';

const helloCommand: Command = {
    guildOnly: false,
    register_command: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Displays all commands available to you!'),
    async execute(client: Client, interaction: CommandInteraction) {
        return interaction.reply({ content: `World!`, ephemeral: true });
    }
};

export default helloCommand;
