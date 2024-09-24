import { Client, Events } from "discord.js";
import Logger from '../utils/logger';

const logger = new Logger("ready");

export default {
    event: Events.ClientReady,
    type: "once",
    async call(client: Client) {
        logger.success(`Connected! You're in as ${client.user?.username} currently serving ${client.guilds.cache.size} Server(s)`);
    }
};
