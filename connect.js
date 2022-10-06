require("dotenv").config(); //to start process from .env file

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!'
    }, 
    {
        name: 'add',
        description: 'Adds to your score'
    },
    {
        name: 'list',
        description: 'lists to user scores'
    }
]; 

const CLIENT_ID = "1027390468197199882";
const GUILD_ID = "1027389427997229128"

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();