const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    /* Set to true if it should only be available to guilds specified in the .env */
    guildOnly: false,
    register_command: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Displays all commands available to you !'),
    async execute(client, interaction) {
        return interaction.reply({
            content: `World!`,
            flags: MessageFlags.Ephemeral,
        })
    }
}