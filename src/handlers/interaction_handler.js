const { GetInteractionHandlersForStaticMessages } = require('../utils/initialisation/setup_staticMessages');

const log = new require('../utils/logger.js');
const logger = new log("Interaction Handler");

const callbacks = GetInteractionHandlersForStaticMessages();

module.exports = async (client,interaction) => {
    const { customId } = interaction;

    if (typeof callbacks[customId] === 'function') {        
        return await callbacks[customId](client, interaction);
    }
}