# discord-js-template

## Features
1. SQLite Database handler (located in `./src/utils/database/`):
    - `executeStatement(sqlquery: string, params?: string[]) => Promise<number|string|Error>`
        - execute an update query or an insert query
    - `executeTransaction({sqlquery: string, params?: string[]}[]) => Promise<boolean|Error>`
        - execute multiple statements either update or insert
    - `executeQuery(sqlquery: string, params?: string[], action?: "get"|"all") => Promise<object|object[]|Error>`
        - execute a query to return one entry or all entries, will default to using `"get"` if not specified.
        - `"get"` will return a single line that satisfies the query and parameters
        - `"all"` will return all lines that satisfy the query and parameters

2. Application commands (located in `./src/commands/`):
    - You can set the command to be restricted to the main guild, requires that the `MAIN_GUILD` field be set in the `.env`
    - To define a new command you only need to create a new file, it's export has to be the following structure:
    ```js
    guildOnly: boolean,
    register_command: SlashCommandBuilder, // from discord.js
    execute: async function (client: Client, interaction: ChatInputCommandInteraction) {}, // Client & ChatInputCommandInteraction from discord.js
    ```

3. Event handlers (located in `./src/events/`):
    - To define a new event handler you only need to create a new file, it's export has to be the following structure:
    ```js
    event: Events enum, // from discord.js
    type: "once"|"on",
    call: async function (client: Client, ...) {}, // Client from discord.js, ... args relating to the event check discord.js documentation
    ```

4. Static Message handler (located in `./src/staticMessages/`):
    - To define a new static message you only need to create a new file, it's export has to be the following structure:
    ```js
    customId: string[],
    setup: async function (client: Client) {}, // Client from discord.js
    callback: async function (client: Client, interaction: CommandInteraction) {}, // Client & CommandInteraction from discord.js
    ```

## Setup
Copy the `.env.example` file to `.env`
```bash
cp .env.example .env
```

Open it with your favorite editor, Nano, Vim or Emacs.

Replace the `TOKEN` in the `.env` file with your own Authentication Token given to you by Discord in their portal 
Replace the `MAIN_GUIlD` in the `.env` file with the discord ID of your main discord guild 

## DO NOT MAKE THE .env FILE PUBLIC
By default, `.env` is git ignored (meaning it is ignored by git). If you disable this, there can be huge security risks such as
- Hackers being able to use your authentication token and using it for malicious purposes
- Bad in general

If you do not touch the `.gitignore` then you should be fine. But be sure not to remove the `.env` part from the `.gitignore`.

## Create new functions
When specifying a main guild in the .env (by using it's Discord ID) this give you the possibility of creating commands restricted to that one.
To do so, make sure that the exported object that it contains the `guildOnly` key and set to true.
If the key isn't set it'll default to a global command, if the `MAIN_GUILD` key isn't set in the `.env` it won't register them.
