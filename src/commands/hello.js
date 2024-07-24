const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')

module.exports = {
    /* Set to true if it should only be available to guilds specified in the .env */
    guildOnly: false,
    register_command: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays all commands available to you !'),
    async execute(client, interaction) {
        return interaction.reply({content:`World!`,ephemeral :true})
    }
}