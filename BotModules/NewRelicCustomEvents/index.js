var newrelic = require('newrelic');

module.exports = function(bot) {

  bot.on('ready', () => {
    console.info(`Stats-Bot logged in as ${bot.user.tag}!`);
  });

  bot.on("message", message => {
    let messageStats = {
      user : message.author.username,
      channel : message.channel.name,
      isBot : message.author.bot,
      id : message.id
    };

    newrelic.recordCustomEvent('DiscordUsageStats', messageStats);
  })

}
