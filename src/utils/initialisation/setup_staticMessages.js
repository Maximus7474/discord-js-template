const fs = require('fs')
const log = new require('../logger.js')
const logger = new log("Static Message loader")
const path_to_events = __dirname + '/../../staticMessages/'

module.exports = {
    InitializeStaticMessages (client) {
        const events = fs.readdirSync(path_to_events).filter(file => file.endsWith('.js'));
    
        for (const element of events) {
            const loaded_element = require(path_to_events + element);
    
            if (typeof loaded_element.setup !== 'function') {
                logger.warn(element, "isn't a function and will not be run.")
                continue;
            }
            
            loaded_element.setup(client);
        }
        logger.info("Static Messages loaded");
    },
    GetInteractionHandlersForStaticMessages () {
        
        const events = fs.readdirSync(path_to_events).filter(file => file.endsWith('.js'));

        const callbacks = {};
    
        for (const element of events) {
            const loaded_element = require(path_to_events + element);
    
            if (typeof loaded_element.customId !== 'string' && !Array.isArray(loaded_element.customId)) {
                logger.warn(element, "doesn't have a custom id, it will be skipped.");
                continue;
            }

            let customIds = loaded_element.customId;
            if (!Array.isArray(customIds)) customIds = [customIds];

            customIds.forEach(id => {
                if (callbacks[id]) {
                    logger.error('Interaction with ID', id, 'from', element.split('.')[0], 'is already registered, it cannot be added!');
                } else {
                    callbacks[id] = loaded_element.callback
                }
            });
            
        }

        return callbacks;
    }
}