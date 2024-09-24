import fs from 'fs';
import Logger from '../logger';
import { Client } from 'discord.js';
import path from 'path';
import { Event } from '../interfaces/interfaces';

const logger = new Logger("Event loader");
const path_to_events = path.join(__dirname, '../../events/');

export default (client: Client): void => {
    const events = fs.readdirSync(path_to_events).filter(file => file.endsWith('.ts'));

    for (const element of events) {
        const element_loaded: Event = require(path.join(path_to_events, element)).default;

        if (!element_loaded.type) {
            logger.error(`Failed to load ${element} type`);
            continue;
        }

        if (!element_loaded.call) {
            logger.error(`Failed to load ${element} call`);
            continue;
        }

        switch (element_loaded.type) {
            case 'on':
                logger.success(`Successfully loaded ${element} event`);
                client.on(element_loaded.event, (...args) => element_loaded.call(client, ...args));
                break;

            case 'once':
                logger.success(`Successfully loaded ${element} event`);
                client.once(element_loaded.event, (...args) => element_loaded.call(client, ...args));
                break;

            default:
                logger.error(`Type of ${element} is not allowed!`);
        }
    }

    logger.info("Events loaded");
};
