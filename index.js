/*
This is the file to run all bots.
Just require your bot to add it to the list of running bots.
*/

//Config
// TODO: Using .env files isn't really ideal for the Current server. Find new secret's manager. 
require('dotenv').config();

// New Relic
require('newrelic');

// Running bots
// TODO: Remove the deprecated bots. 
// require('./BotModules/Budgett/index');
// require('./BotModules/Megabot/index');