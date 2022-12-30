const schedule = require('node-schedule')
const { Client, GatewayIntentBits } = require('discord.js');
const getWednesdayMeme = require('./utils/utils');

const chatID = process.env.BUDGETT_CHAT_ID;

let token = process.env.BUDGETT_TOKEN;
const bot = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
	],
});


var loggedin = false;

function login(){
  if(token){
    bot.login(token);
  }
}

const logOn = schedule.scheduleJob('0 0 4 * * 3', function(){
    console.log("It's Wednesday My Dudes!")
    login();
});

const logOut = schedule.scheduleJob('0 30 21 * * 3', function(){
    console.log("Wednesday's Over My Dudes!")
    bot.destroy();
  loggedin = false;
});

const postWednesdayMessage = schedule.scheduleJob('0 10 9 * * 3', function(){
    console.log("Reminding the Bois it's wednesday.")
    if(!loggedin){ login(); }
    bot.channels.cache.get(chatID).send(`It's Wednesday My Dudes!`);
});

const postWednesdayMeme = schedule.scheduleJob('0 40 11 * * 3', function(){
    console.log("Meme Time");
    if(!loggedin){ login(); }
    getWednesdayMeme()
        .then(meme => bot.channels.cache.get(chatID).send(meme))
});

bot.on('ready', () => {
    console.log('Ready for Wednesday my dude?');
    if(process.env.ENVIRONMENT == 'STAGING'){
        console.log("Are you ready kids?")
        getWednesdayMeme()
            .then(meme => bot.channels.cache.get(chatID).send(meme))
    }
    loggedin = true;
});

bot.on("message", message => {
        if(message.content.match('GIVE ME WEDNESDAY!')){
            getWednesdayMeme()
            .then(meme => bot.channels.cache.get(chatID).send(meme))
        }
  })



if(process.env.ENVIRONMENT == 'STAGING' || new Date().getDay() === 3){
  login();
  console.log('It\'s wednesday');
}else{
  console.log(`Budgett is sleeping for now, he'll return next wednesday.`)
}

