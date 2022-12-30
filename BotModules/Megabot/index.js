const { Client, GatewayIntentBits } = require('discord.js');

console.log(Object.keys(require('discord.js')))

console.log('blah')
console.log(GatewayIntentBits)

const bot =new Client({
	intents: [
		GatewayIntentBits.MessageContent,
	],
});

// Import Bot Commands
const Commander = require('../CommanderInChief/commander-in-chief');
const pagerBot = require('../Pager/index');

// Import bots that Require being attached to the Discord-Bot (Deprecated)
let ScreechBot = require('../ScreechBot/index')(bot);
let SteamBot = require('../SteamBot/index')(bot);


require('../MemeNarc/index')(bot);

require('../NewRelicCustomEvents/index')(bot);

// Attach Bot To Commander
Commander.attachToBot(bot);

// Attach all commands to The Commander Bot
Commander.registerCommands("Screechbot", ScreechBot.commands);
Commander.registerCommands("SteamBot", SteamBot.commands);
Commander.registerCommands("PagerBot", pagerBot.commands);


const TOKEN = process.env.BOT_TOKEN;

if(TOKEN) {
  bot.login(TOKEN);
}
