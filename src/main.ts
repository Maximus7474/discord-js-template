import Discord from 'discord.js';
import dotenv from 'dotenv';
import assert from 'assert';
import find_events from './utils/initialisation/find_events';
import setup_commands from './utils/initialisation/setup_commands';
import { InitializeStaticMessages } from './utils/initialisation/setup_staticMessages';
import { Client } from './types/client';

dotenv.config();

assert(process.env.TOKEN, "A Discord Token for your bot is required ! Please go to your application page to get it! Set your token then as an enviormental variable with the TOKEN variable name!")

const client: Client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.Reaction,
    ],
});

client.commands = new Discord.Collection();

find_events(client);

setup_commands(client);

client.login(process.env.TOKEN);

client.once(Discord.Events.ClientReady, (client)=>{
    InitializeStaticMessages(client);
});