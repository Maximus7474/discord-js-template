const Discord = require('discord.js');
require('dotenv').config();
const assert = require('assert');
const find_events = require('./utils/initialisation/find_events');
const setup_commands = require('./utils/initialisation/setup_commands');
const { InitializeStaticMessages } = require('./utils/initialisation/setup_staticMessages');
const { initializeDatabase } = require('./utils/database/sqliteHandler');

assert(process.env.TOKEN, "A Discord Token for your bot is required ! Please go to your application page to get it! Set your token then as an enviormental variable with the TOKEN variable name!")

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.Reaction
    ]
});

initializeDatabase();

find_events(client);

setup_commands(client);

client.login(process.env.TOKEN);

client.once(Discord.Events.ClientReady, (client)=>{
    InitializeStaticMessages(client);
});