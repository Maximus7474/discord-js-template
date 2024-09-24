import { Client, Interaction, Events } from "discord.js";
import Logger from '../utils/logger';
import interactionHandler from '../handlers/interaction_handler';

const logger = new Logger("interactionCreate");

export default {
    event: Events.InteractionCreate,
    type: "on",
    async call(client: Client, interaction: Interaction) {
        if (interaction.isCommand()) {
            if (!Object.keys(client.commands).includes(interaction.commandName)) {
                logger.warn(`Command ${interaction.commandName} not found or loaded`);

                return interaction.reply({
                    content: `Command not found please report this!`,
                    ephemeral: true
                });
            }

            const command = client.commands[interaction.commandName];

            try {
                return await command.execute(client, interaction);
            } catch (error) {
                logger.error(error);

                return interaction.reply({
                    content: `Error executing command! Please try again, if the error persists please report to a developer`,
                    ephemeral: true
                }).catch(() => { });
            }
        } else {
            try {
                await interactionHandler(client, interaction);
            } catch (err) {
                const interactionId = 'customId' in interaction ? interaction.customId : 'unknown interaction';
                logger.error(`Interaction handler had an issue handling interaction ${interactionId}: ${err}`);
            }
            return
        }
    }
};
