const schedule = require('node-schedule')
const { Client, Events, IntentsBitField } = require('discord.js');
const {getWednesdayMeme} = require('./utils/utils');

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
    console.log("It's Wednesday My Dudes!")
    login();
});

const logOut = schedule.scheduleJob('0 30 21 * * 3', function(){
    console.log("Wednesday's Over My Dudes!")
    client.destroy();
  loggedin = false;
});

const postWednesdayMessage = schedule.scheduleJob('0 10 9 * * 3', function(){
    console.log("Reminding the Bois it's wednesday.")
    if(!loggedin){ login(); }
    client.channels.cache.get(chatID).send(`It's Wednesday My Dudes!`);
});

const postWednesdayMeme = schedule.scheduleJob('0 40 11 * * 3', function(){
    console.log("Meme Time");
    if(!loggedin){ login(); }
    sendWednesdayMeme();
});

client.on('ready', () => {
    console.log('Ready for Wednesday my dude?');
    if(process.env.ENVIRONMENT == 'STAGING'){
        console.log("Are you ready kids?")
        sendWednesdayMeme();
    }
    loggedin = true;
});

client.on(Events.MessageCreate, message => {
        if(message.content.match('GIVE ME WEDNESDAY!')){
          sendWednesdayMeme();
        }
  })

login();

console.log(`It's wednesday`);
