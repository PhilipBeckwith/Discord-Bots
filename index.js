/*
This is the file to run all bots.
Just require your bot to add it to the list of running bots.
*/

//Config
require('dotenv').config();

// Running bots
require('./BotModules/Budgett/index');
require('./BotModules/Megabot/index');