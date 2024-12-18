const fs = require('fs');
const path = require('path');
const log = new require('../src/utils/logger.js');
const logger = new log("Command loader");
const { SlashCommandBuilder } = require('discord.js');
const path_to_commands = path.join(__dirname, '/../src/commands/');

function getAllJsFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllJsFiles(path.join(dirPath, file), arrayOfFiles);
        } else if (file.endsWith('.js')) {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });

    return arrayOfFiles;
}

module.exports = () => {
    const commandFiles = getAllJsFiles(path_to_commands);

    let guildCommands = {}
    let globalCommands = {}
    let guildStack = [];
    let globalStack = [];

    for (const filePath of commandFiles) {
        const command_loaded = require(filePath);
        const commandName = path.basename(filePath);

        if (!command_loaded) {
            logger.error(`${commandName} not valid`);
            continue;
        }
        if (typeof command_loaded.execute === 'undefined' || typeof command_loaded.execute !== 'function') {
            logger.error(`${commandName} does not have the execute function`);
            continue;
        }
        if (!(command_loaded.register_command instanceof SlashCommandBuilder)) {
            logger.error(`${commandName} does not have the register_command SlashCommandBuilder instance`);
            continue;
        }

        if (command_loaded.guildOnly === 'undefined' || typeof command_loaded.guildOnly !== 'boolean' || !command_loaded.guildOnly) {
            if (Object.keys(globalCommands).includes(command_loaded.register_command.name)) {
                logger.warning(`Two or more global commands share the name ${command_loaded.register_command.name}`);
                continue;
            }

            globalCommands[command_loaded.register_command.name] = command_loaded;
            globalStack.push(command_loaded.register_command);

            logger.success(`Successfully loaded ${commandName} (global)`);
        } else {
            if (Object.keys(guildCommands).includes(command_loaded.register_command.name)) {
                logger.warning(`Two or more guild commands share the name ${command_loaded.register_command.name}`);
                continue;
            }

            guildCommands[command_loaded.register_command.name] = command_loaded;
            guildStack.push(command_loaded.register_command);

            logger.success(`Successfully loaded ${commandName} (guild)`);
        }
    }

    logger.info(`Commands loaded: Guild (${guildStack.length}), Global (${globalStack.length})`);
    return { globalStack, guildStack };
};
