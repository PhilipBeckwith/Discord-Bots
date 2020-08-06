const {
  prefix,
  id, userName,
  memeChatName, memeChatID,
  botScriptChatName, botScriptChatID,
  testMode
} = require('./config.json');

const regex = '(https:\/\/)?(9gag\.com\/gag\/).*';

let targetChatID;
let targetChatName;

module.exports = function(bot) {

  bot.on('ready', () => {
    if(testMode == 'true'){
      targetChatID = botScriptChatID;
      targetChatName = botScriptChatName;
    }else{
      targetChatID = memeChatID;
      targetChatName = memeChatName;
    }
    console.log('Up and Sweeping away!');
  });

  bot.on("message", message => {
    if(message.author.bot == false) { //Any bot can post memes
      if(message.channel.id != targetChatID && message.channel.name != targetChatName){ // Won't repost to same chat
        if(message.content.match(regex)){
          bot.channels.resolveID()
          bot.channels.cache.get(targetChatID).send(
            `${message.author.username} Posted a Meme On ${message.channel.name}:\n${message.content}`
          );
          console.log("Message from Re-Homed")
          message.delete();
          console.log("Mess cleaned.")
        }
      }
    }
  })

}
