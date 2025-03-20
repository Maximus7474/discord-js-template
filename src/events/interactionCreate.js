const Discord = require("discord.js")
const log = new require('../utils/logger.js')
const logger = new log("interactionCreate") 
const interaction_handler = require('../handlers/interaction_handler')


module.exports = {
    event: Discord.Events.InteractionCreate,
    type: "on",
    /**
     * @param {Discord.Client} client 
     * @param {Discord.Interaction} interaction 
     */
    async call(client, interaction) {

        if(interaction.isChatInputCommand()) {

            if(!Object.keys(client.commands).includes(interaction.commandName)) {
                logger.warn(`Command ${interaction.commandName} not found or loaded`);

                return interaction.reply({
                    content:`Command not found please report this!`,
                    ephemeral: true
                });
            };
            
            const command = client.commands[interaction.commandName];
            
            try {
                return await command.execute(client,interaction)
            } catch (error) {
                logger.error(error)

                return interaction.reply({
                    content:`Error executing command! Please try again, if error persists please report to a developer`,
                    ephemeral: true
                }).catch(() => "");
            }
        } else {
            return await interaction_handler(client,interaction)
                .catch((err) => {
                    logger.error(`Interaction handler had issue handling interaction ${interaction.customID} ${err}`)
                });
        }
    }
}