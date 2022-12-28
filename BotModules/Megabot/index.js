const { Client, GatewayIntentBits } = require('discord.js');

const bot = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
	],
});

const Commander = require('../CommanderInChief/commander-in-chief');

Commander.attachToBot(bot);
require('../MemeNarc/index')(bot);


// TODO fix and Enable These broken bots.
//let SteamBot = require('../SteamBot/index')(bot);
//Commander.registerCommands("SteamBot", SteamBot.commands);
//let ScreechBot = require('../ScreechBot/index')(bot);
//Commander.registerCommands("Screechbot", ScreechBot.commands);

require('../NewRelicCustomEvents/index')(bot);

const TOKEN = process.env.BOT_TOKEN;

if(TOKEN) {
  bot.login(TOKEN);
}
