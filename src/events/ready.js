const Discord = require("discord.js")
const log = new require('../utils/logger.js')
const logger = new log("ready") 
module.exports = {
    event: Discord.Events.ClientReady,
    type: "once",
    /**
     * 
     * @param {Discord.Client} client 
     */
    async call(client) {
        logger.success(`Logged in & connected as ${client.user.username}, serving ${client.guilds.cache.size} server(s)`)
    }
}