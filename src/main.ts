import { Client, GatewayIntentBits, Partials, Events } from 'discord.js';
import 'dotenv/config';
import assert from 'assert';
import find_events from './utils/initialisation/find_events';
import setup_commands from './utils/initialisation/setup_commands';
import { Command } from './utils/interfaces/interfaces';

assert(process.env.TOKEN, "A Discord Token for your bot is required! Please go to your application page to get it! Set your token as an environmental variable with the TOKEN variable name!");

declare module 'discord.js' {
    interface Client {
        commands: Record<string, Command>;
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

find_events(client);
setup_commands(client);

client.login(process.env.TOKEN);

client.once(Events.ClientReady, (client: Client<boolean>) => {
    // Add your logic here for when the client is ready
});
