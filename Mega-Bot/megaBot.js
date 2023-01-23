const logger = require('../utils/logger').getLogger('mega-bot')
const { Client, IntentsBitField, GatewayIntentBits } = require('discord.js');
const {registerSlashCommands, publishSlashCommands, registerInteractionListener} = require('./bots/slash-commands')
const {BOT_TOKEN, MEGA_BOT_APP_ID, HOME_GUILD_ID, ENVIRONMENT} = process.env;

logger.info('MegaBot Starting up...')

const client = new Client({
	intents: [
		IntentsBitField.Flags.MessageContent,
    	IntentsBitField.Flags.Guilds,
    	IntentsBitField.Flags.GuildMessages,
		GatewayIntentBits.Guilds
	],
});

// Import Bot aspects
const Commander = require('./bots/commander-in-chief');
const pagerBot = require('./bots/twillio');

require('./bots/meme-narc')(client);
require('./bots/NR-custom-events')(client);

Commander.attachToBot(client);

// TODO
// // Import bots that Require being attached to the Discord-Bot (Deprecated)
// let ScreechBot = require('../ScreechBot/index')(bot);
// let SteamBot = require('../SteamBot/index')(bot);
// // Attach all commands to The Commander Bot
// Commander.registerCommands("Screechbot", ScreechBot.commands);
// Commander.registerCommands("SteamBot", SteamBot.commands);

registerSlashCommands(pagerBot.slashCommands)
registerInteractionListener(client)

logger.info('All sub bot behavours registerd...')

if(BOT_TOKEN) {
	client.login(BOT_TOKEN);
	if(ENVIRONMENT !=='PRODUCTION'){
		publishSlashCommands(BOT_TOKEN, MEGA_BOT_APP_ID, HOME_GUILD_ID)
	}else{
		publishSlashCommands(BOT_TOKEN, MEGA_BOT_APP_ID)
	}
}
