import fs from 'fs';
import Logger from '../logger';
import { Client } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import path from 'path';
import { Command } from '../interfaces/interfaces';

const logger = new Logger("Command loader");
const path_to_commands = path.join(__dirname, '../../commands/');

export default (client: Client): void => {
    const commandFiles = fs.readdirSync(path_to_commands).filter(file => file.endsWith('.ts'));

    client.commands = {} as Record<string, Command>;

    for (const command of commandFiles) {
        const command_loaded: Command | undefined = require(path.join(path_to_commands, command));

        if (!command_loaded) {
            logger.error(`${command} is not valid`);
            continue;
        }

        if (typeof command_loaded.execute === 'undefined' || typeof command_loaded.execute !== 'function') {
            logger.error(`${command} does not have the execute function, skipping...`);
            continue;
        }

        if (!(command_loaded.register_command instanceof SlashCommandBuilder)) {
            logger.error(`${command} does not have a valid register_command instance, skipping...`);
            continue;
        }

        if (client.commands[command_loaded.register_command.name]) {
            logger.warn(`Two or more commands share the name ${command_loaded.register_command.name}, skipping...`);
            continue;
        }

        client.commands[command_loaded.register_command.name] = command_loaded;

        logger.success(`Successfully loaded ${command} interaction handler`);
    }

    logger.info("Commands loaded");
};
