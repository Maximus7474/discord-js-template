# discord-js-template
This is my template for most of my discord.js bots, feel free to use!

## Setup
Copy the `.env.example` file to `.env`
```bash
cp .env.example .env
```

Open it with your favorite editor, Nano, Vim or Emacs.

Replace the `TOKEN` in the `.env` file with your own Authentication Token given to you by Discord in their portal 

## DO NOT MAKE THE .env FILE PUBLIC
By default, `.env` is git ignored (meaning it is ignored by git). If you disable this, there can be huge security risks such as
- Hackers being able to use your authentication token and using it for malicious purposes
- Bad in general

If you do not touch the `.gitignore` then you should be fine. But be sure not to remove the `.env` part from the `.gitignore`.

## Create new functions
When specifying a main guild in the .env (by using it's Discord ID) this give you the possibility of creating commands restricted to that one.
To do so, make sure that the exported object that it contains the `guildOnly` key and set to true.
If the key isn't set it'll default to a global command, if the `MAIN_GUILD` key isn't set in the `.env` it won't register them.