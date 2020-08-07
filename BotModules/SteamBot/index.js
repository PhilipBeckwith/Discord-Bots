const MongoDB = require('../../MongoDB/MongoDB')
const Commander = require('../CommanderInChief/commander-in-chief');

module.exports = function(bot) {

  var commands = [{
    keyword: '/games',
    helptext: 'Sends a list of all shared games between mentioned users',
    action: pullMentions(ShowAllSharedGames)
  },{
    keyword: '/pickgame',
    helptext: 'Sends a game chosen randomly from a list of games shared between mentioned users',
    action: pullMentions(PickRandomSharedGame)
  }];

  Commander.registerCommands("Steambot", commands);

  bot.on('ready', () => {
    console.info(`Steambot logged in as ${bot.user.tag}!`);
  });

  function pullMentions(action){
    return function(msg) {
      let arrMentions = msg.mentions.users.map(user => user.id)
      if(arrMentions.length > 1){
        action(msg, arrMentions);
      }
    }
  }

  function PickRandomSharedGame(msg, mentions){
    MongoDB.GetCommonGames(mentions).then(games =>{
      let rdmIdx = Math.floor(Math.random() * games.length)
      msg.channel.send(`Lets play ${games[rdmIdx].name}!`)
      MongoDB.Close()
    })
    .catch(err => console.log(err))
  };

  function ShowAllSharedGames(msg, mentions){
    MongoDB.GetCommonGames(mentions).then(games =>{
      msg.channel.send(`${msg.mentions.users.map(user => user.username).join(", ")} share: \n${games.map(game => game.name).join("\n")}`)
      MongoDB.Close()
    })
    .catch(err => console.log(err))
  };
}
