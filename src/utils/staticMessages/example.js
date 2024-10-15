const { } = require('discord.js');

const log = new require('../logger.js');
const logger = new log("Static Message");

module.exports = {
    /* Can also by a simple string */
    customId: ['customId'],
    /* Setup function that is run on client start */
    async setup (client) {
        logger.info('Static Message has been setup')
    },
    /* The function called for any interactions created using the specified customId */
    async callback (client, interaction) {
        logger.warn('There is no callback function for \'customId\'');        
    }
}