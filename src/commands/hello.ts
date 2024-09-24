import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';

export default {
    /* Set to true if it should only be available to guilds specified in the .env */
    guildOnly: false,
    register_command: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Displays all commands available to you!'),
    async execute(client: Client, interaction: CommandInteraction) {
        return interaction.reply({ content: `World!`, ephemeral: true });
    }
};
