const { Client, Events, IntentsBitField } = require('discord.js');
const TOKEN = process.env.BOT_TOKEN;

const client = new Client({
	intents: [
		IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
	],
});

// Import Bot Commands
const Commander = require('./bots/commander-in-chief');
const pagerBot = require('./bots/twillio');

// TODO
// // Import bots that Require being attached to the Discord-Bot (Deprecated)
// let ScreechBot = require('../ScreechBot/index')(bot);
// let SteamBot = require('../SteamBot/index')(bot);


require('./bots/meme-narc')(client);
require('./bots/NR-custom-events')(client);

// TODO
// // Attach Bot To Commander
Commander.attachToBot(client);

// // Attach all commands to The Commander Bot
// Commander.registerCommands("Screechbot", ScreechBot.commands);
// Commander.registerCommands("SteamBot", SteamBot.commands);
Commander.registerCommands("PagerBot", pagerBot.commands);


if(TOKEN) {
	client.login(TOKEN);
}
