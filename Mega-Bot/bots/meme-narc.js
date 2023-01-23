const logger = require('../../utils/logger').getLogger('meme-narc')
const {instrementSegment, instrementBackgroundTransaction} = require('../../utils/newRelic-utils')
const {Events} = require('discord.js');

const regex = /(https:\/\/)?(9gag\.com\/gag\/).*/g;
const memeChatID = process.env.MEMENARC_CHANNEL_ID;

function registerListeners(client) {
  client.on(Events.MessageCreate, enforceMemeChanel.bind(null, client))
  client.on('ready', () => {
    logger.info('Up and Sweeping away!');
  });
}

function memeIsInWrongChannel(message){
  return !message.author.bot &&         // Bots are not enforced 
    message.channel.id != memeChatID && // Don't move messages already in the correct place.
    message.content.match(regex);       // Only Move Memes. 
}

async function enforceMemeChanel(client, message){
  if(memeIsInWrongChannel(message)){
    await Promise.all([
      moveMemeToMemeChannel(client, message),
      deleteMessage(message)
    ])
  }
}

async function moveMemeToMemeChannel(client, message){
  await client.channels.cache.get(memeChatID)
    .send(`${message.author.username} Posted a Meme On ${message.channel.name}:\n${message.content}`);
    logger.info("Message Re-Homed")
}

async function deleteMessage(message){
  await message.delete();
  logger.info("Mess cleaned.")
}

memeIsInWrongChannel = instrementSegment(memeIsInWrongChannel)
enforceMemeChanel = instrementBackgroundTransaction(enforceMemeChanel)
moveMemeToMemeChannel = instrementSegment(moveMemeToMemeChannel)
deleteMessage = instrementSegment(deleteMessage)

module.exports = registerListeners;