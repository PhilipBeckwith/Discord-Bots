const Discord = require('discord.js');
const bot = new Discord.Client();

const Commander = require('../CommanderInChief/commander-in-chief');

Commander.attachToBot(bot);
require('../MemeNarc/index')(bot);
let ScreechBot = require('../ScreechBot/index')(bot);
Commander.registerCommands("Screechbot", ScreechBot.commands);
let SteamBot = require('../SteamBot/index')(bot);
Commander.registerCommands("SteamBot", SteamBot.commands);
require('../NewRelicCustomEvents/index')(bot);

const TOKEN = process.env.BOT_TOKEN;

if(TOKEN) {
  bot.login(TOKEN);
}
