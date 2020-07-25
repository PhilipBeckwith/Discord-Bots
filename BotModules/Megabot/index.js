const Discord = require('discord.js');
const bot = new Discord.Client();

require('../MemeNarc/index')(bot);
require('../ScreechBot/index')(bot);

const TOKEN = process.env.BOT_TOKEN;

if(TOKEN) {
  bot.login(TOKEN);
}
