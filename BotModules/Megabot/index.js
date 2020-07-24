const Discord = require('discord.js');
const client = new Discord.Client();

require('../MemeNarc/index')(client);
require('../ScreechBot/index')(client);

const TOKEN = process.env.BOT_TOKEN;

client.login(TOKEN);
