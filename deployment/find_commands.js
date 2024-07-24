const fs = require('fs')
const log = new require('../logger.js')
const logger = new log("Command loader")
const { SlashCommandBuilder } = require('@discordjs/builders');
const path_to_commands = __dirname + '/../../commands/'

module.exports = () => {
    const commandFiles = fs.readdirSync(path_to_commands).filter(file => file.endsWith('.js'));

    let stack = []
    let commands = {}

    for (const command of commandFiles) {
        const command_loaded = require(path_to_commands + command)
        if (!command_loaded) { logger.error(`${command} not valid`); continue}
        if (typeof command_loaded.execute === 'undefined' || typeof command_loaded.execute !== 'function') { logger.error(`${command} does not have the execute function`); continue }
        if (command_loaded.register_command instanceof SlashCommandBuilder == false) { logger.error(`${command} does not have the register_command SlashcommandBuilder instance`);continue}

        if (Object.keys(commands).includes(command_loaded.register_command.name)) { logger.warning(`Two or more commands share the name ${command_loaded.register_command.name}`);continue}

        commands[command_loaded.register_command.name] = command_loaded
        stack.push(command_loaded.register_command)

        logger.success(`Successfully loaded ${command}`)
    }
    logger.info("Commands loaded")
    return stack
}