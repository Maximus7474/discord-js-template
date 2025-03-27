import fs from 'fs';
import path from 'path';
import Logger from '../logger';
import { Collection, SlashCommandBuilder } from 'discord.js';
import { Client } from '../../types/client';

const logger = new Logger("Command loader");
const pathToCommands = path.join(__dirname, '../../commands/');

export default (client: Client): void => {
    const commandFiles = fs.readdirSync(pathToCommands).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    if (!client.commands) client.commands = new Collection();

    for (const command of commandFiles) {
        const commandPath = path.join(pathToCommands, command);
        const commandLoaded = require(commandPath);

        if (!commandLoaded) {
            logger.error(`${command} is not valid`);
            continue;
        }

        if (typeof commandLoaded.execute !== 'function') {
            logger.error(`${command} does not have the execute function, skipping...`);
            continue;
        }
        
        if (!(commandLoaded.register_command instanceof SlashCommandBuilder)) {
            logger.error(`${command} does not have a valid register_command SlashCommandBuilder instance and may not work properly, skipping...`);
            continue;
        }

        if (client.commands.get(commandLoaded.register_command.name)) {
            logger.warn(`Two or more commands share the name ${commandLoaded.register_command.name}, skipping...`);
            continue;
        }

        client.commands.set(commandLoaded.register_command.name, commandLoaded);
        logger.success(`Successfully loaded ${command} interaction handler`);
    }

    logger.info("Commands loaded");
};
