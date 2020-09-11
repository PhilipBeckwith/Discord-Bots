const MongoConnection = require("../../MongoDB/MongoConnection")

module.exports = function(bot) {

  var commands = [{
    keyword: '/games',
    helptext: 'Sends a list of all shared games between mentioned users',
    action: ShowAllSharedGames
  },{
    keyword: '/pickgame',
    helptext: 'Sends a game chosen randomly from a list of games shared between mentioned users',
    action: PickRandomSharedGame
  },{
    keyword: '/search',
    helptext: 'Searches Games Collection for game that most closely matches message content. Limits results up to 3',
    action: SearchGames
  }];

  bot.on('ready', () => {
    console.info(`Steambot logged in as ${bot.user.tag}!`);
  });

  function PickRandomSharedGame(msg){
    let mentions = msg.mentions.users.map(user => user.id)
    if(mentions.length > 1){
      MongoConn = new MongoConnection()
      MongoConn.GetCommonGames(mentions).then(games =>{
        let rdmIdx = Math.floor(Math.random() * games.length)
        msg.channel.send(`Lets play ${games[rdmIdx].name}!`)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(()=>{
        MongoConn.CloseConnection()
      })
    }
  };

  function ShowAllSharedGames(msg){
    let mentions = msg.mentions.users.map(user => user.id)
    if(mentions.length > 1){
      MongoConn = new MongoConnection()
      MongoConn.GetCommonGames(mentions).then(games =>{
        msg.channel.send(`${msg.mentions.users.map(user => user.username).join(", ")} share: \n${games.map(game => game.name).join("\n")}`)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(()=>{
        MongoConn.CloseConnection()
      })
    }
  };

  function SearchGames(msg){
    let searchText = msg.content.replace("/search", "").trim()
    if(searchText === ""){
      msg.channel.send("Invalid Search")
      return
    }
    let pattern = new RegExp(escapeRegex(searchText), 'gi');
    msg.channel.send("Searching games...")
    MongoConn = new MongoConnection()
    MongoConn.SearchGamesFromText(pattern).then(games =>{
      if(games.length == 0){
        msg.channel.send("No Results Found")
      }
      else{
        games.forEach(game => {
          msg.channel.send(`${game.name}:\n\tIs owned by: ${game.members.map(member => member.alias).join(", ")}`)
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(()=>{
      MongoConn.CloseConnection()
    })
  }

  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  return {
    commands
  }
}
