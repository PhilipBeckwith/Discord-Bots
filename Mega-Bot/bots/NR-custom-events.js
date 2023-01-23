const logger = require('../../utils/logger')('NR-Event-Emmiter')
var newrelic = require('newrelic');
const {Events} = require('discord.js');

function reccordMessageStats(message){
  let messageStats = {
    user : message.author.username,
    channel : message.channel.name,
    isBot : message.author.bot,
    id : message.id
  };
  try{
    newrelic.recordCustomEvent('DiscordUsageStats', messageStats);
  }catch(err){
    logger.warn("Well shit.... There goes our observability.")
  }
}

function registerListeners(client) {
  client.on(Events.MessageCreate, reccordMessageStats)
  client.on(Events.ClientReady, () => {
    logger.info(`Stats-Bot logged in as ${client.user.tag}!`);
  });
}

module.exports = registerListeners;