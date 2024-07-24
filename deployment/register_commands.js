const { REST, Routes } = require('discord.js');
const assert = require('assert');
require('dotenv').config();

const log = new require('../src/utils/logger.js');
const logger = new log("Command register");

assert(process.env.TOKEN, "A Discord Token for your bot is required ! Please go to your application page to get it! Set your token then as an enviormental variable with the TOKEN variable name!");
assert(process.env.TOKEN.split('.').length === 3, "The provided TOKEN is incorrectly formed");

function getUserIdFromToken(base64Str) {
    const decodedStr = Buffer.from(base64Str, 'base64').toString('utf-8');
    
    const number = BigInt(decodedStr);
    
    return number.toString();
}

const rest = new REST().setToken(process.env.TOKEN);
const userId = getUserIdFromToken(process.env.TOKEN.split('.')[0]);

assert(userId, "Unable to get the user ID from the provided discord Token, please check the token");

const { globalStack, guildStack } = require('./find_commands')();

try {
    logger.info(`Registering ${(globalStack.length + guildStack.length)} command${(globalStack.length + guildStack.length) > 1?"s":""} to the discord api ...`);

    if(globalStack && globalStack.length > 0) {
        rest.put(
            Routes.applicationCommands(userId),
            { body: globalStack },
        ).then(response => {
            logger.success(`Successfully registered ${response.length} global application (/) command${response.length > 1?"s":""}.`);
        }).catch(err => {
            globalData = false;
            logger.warn(`Unable to load global commands`, err)
        });
    } else logger.info("No global commands to register");

    if(process.env.MAIN_GUILD && guildStack && guildStack.length > 0) {
        rest.put(
            Routes.applicationGuildCommands(userId, process.env.MAIN_GUILD),
            { body: guildStack },
        ).then(response => {
            logger.success(`Successfully registered ${response.length} guild application (/) command${response.length > 1?"s":""}.`);
        }).catch(err => {
            logger.warn(`Unable to load guild commands`, err)
        });
    } else if (!process.env.MAIN_GUILD) {
        logger.info("No guild id defined in the .env under MAIN_GUILD")
    } else {
        logger.info("No guild commands to register")
    }

} catch (error) {
    logger.error(error);
}