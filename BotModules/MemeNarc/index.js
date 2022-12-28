const regex = '(https:\/\/)?(9gag\.com\/gag\/).*';

const memeChatID = process.env.MEMENARC_CHANNEL_ID;

module.exports = function(bot) {

  bot.on('ready', () => {
    console.log('Up and Sweeping away!');
  });

  bot.on("message", message => {
    console.log(message);
    if(message.author.bot == false) { //Any bot can post memes
      if(message.channel.id != memeChatID){ // Won't repost to same chat
        if(message.content.match(regex)){
          bot.channels.resolveID()
          bot.channels.cache.get(memeChatID).send(
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
