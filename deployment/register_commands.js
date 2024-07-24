const { REST, Routes } = require('discord.js');
const log = new require('../logger.js');
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

commands = require('./find_commands')();
if(!commands || commands.length == 0) return logger.info("No commands to register");

try {
    logger.info(`Registering ${commands.length} command${commands.length > 1?"s":""} to the discord api ...`)

    const data = await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands },
    );

    logger.success(`Successfully registered ${data.length} application (/) command${data.length > 1?"s":""}.`);
} catch (error) {
    logger.error(error)
}