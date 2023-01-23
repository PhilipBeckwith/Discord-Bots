const logger = require('../utils/logger')('budgett')
const schedule = require('node-schedule')
const { Client, Events, IntentsBitField } = require('discord.js');
const {getWednesdayMeme} = require('./utils/utils');

const UTC_TO_ARIZONA_TIMEZONE_OFFSET = - 7 * 60 * 60 * 1000;
const LOCAL_TO_UTC_TIMEZONE_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;
const chatID = process.env.BUDGETT_CHAT_ID;

let token = process.env.BUDGETT_TOKEN;
const client = new Client({
	intents: [
		IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
	],
});


var loggedin = false;

function login(){
  if(token){
    client.login(token);
  }
}

async function sendWednesdayMeme(){
  client.channels.cache.get(chatID).send(await getWednesdayMeme())
}


const logOn = schedule.scheduleJob('0 0 4 * * 3', function(){
  logger.info("It's Wednesday My Dudes!")
  login();
});

schedule.scheduleJob({hour: 7, minute: 0, dayOfWeek: 3, tz: 'America/Phoenix' }, function(){
  logger.info("It's Wednesday My Dudes! (TIMEZONE TEST 7:00 AM America/Phoenix)")
  login();
});

const logOut = schedule.scheduleJob('0 30 21 * * 3', function(){
  logger.info("Wednesday's Over My Dudes!")
  client.destroy();
  loggedin = false;
});

const postWednesdayMessage = schedule.scheduleJob('0 10 9 * * 3', function(){
  logger.info("Reminding the Bois it's wednesday.")
  if(!loggedin){ login(); }
  client.channels.cache.get(chatID).send(`It's Wednesday My Dudes!`);
});

const postWednesdayMeme = schedule.scheduleJob('0 40 11 * * 3', function(){
  logger.info("Meme Time");
  if(!loggedin){ login(); }
  sendWednesdayMeme();
});

client.on('ready', () => {
  logger.info('Ready for Wednesday my dude?');
  if(process.env.ENVIRONMENT == 'STAGING'){
    logger.info("Are you ready kids?")
    sendWednesdayMeme();
  }
  loggedin = true;
});

client.on(Events.MessageCreate, message => {
  if(message.content.match('GIVE ME WEDNESDAY!')){
    sendWednesdayMeme();
  }
})

function isWednesday(){
  const date = new Date();

  // Convert to UTC
  date.setTime(date.getTime() + LOCAL_TO_UTC_TIMEZONE_OFFSET)

  // Convert TO AZ Time
  date.setTime(date.getTime() + UTC_TO_ARIZONA_TIMEZONE_OFFSET)

  // Check if it's Wednesday.
  return date.getDay === 3;
}

if(process.env.ENVIRONMENT === 'STAGING' || isWednesday()){
  login();
  logger.info('It\'s wednesday');
}else{
  logger.info(`Budgett is sleeping for now, he'll return next wednesday.`)
}
