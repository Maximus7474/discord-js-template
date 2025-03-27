import fs from 'fs';
import path from 'path';
import Logger from '../logger';
import { Client } from '../../types/client';

const logger = new Logger("Event loader");
const pathToEvents = path.join(__dirname, '../../events/');

export default (client: Client): void => {
    const events = fs.readdirSync(pathToEvents).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    for (const element of events) {
        const elementPath = path.join(pathToEvents, element);
        const elementLoaded = require(elementPath);

        if (!elementLoaded.type) {
            logger.error(`Failed to load ${element} type`);
            continue;
        }
        if (!elementLoaded.call) {
            logger.error(`Failed to load ${element} call`);
            continue;
        }

        switch (elementLoaded.type) {
            case "on":
                logger.success(`Successfully loaded ${element} event`);
                client.on(elementLoaded.event, (...args) => elementLoaded.call(client, ...args));
                break;
            case "once":
                logger.success(`Successfully loaded ${element} event`);
                client.once(elementLoaded.event, (...args) => elementLoaded.call(client, ...args));
                break;
            default:
                logger.error(`Type of ${element} is not allowed!`);
        }
    }

    logger.info("Events loaded");
};
