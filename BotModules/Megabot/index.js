const Discord = require('discord.js');
const bot = new Discord.Client();

require('../CommanderInChief/commander-in-chief').attachToBot(bot);
require('../MemeNarc/index')(bot);
require('../ScreechBot/index')(bot);
require('../SteamBot/index')(bot);
require('../NewRelicCustomEvents/index')(bot);

const TOKEN = process.env.BOT_TOKEN;

if(TOKEN) {
  bot.login(TOKEN);
}
