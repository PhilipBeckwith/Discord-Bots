const schedule = require('node-schedule')
const discord = require('discord.js');
const {generalChatID, testMode} = require('./config.json');

let token = process.env.BUDGETT_TOKEN
const client = new discord.Client();
var loggedin = false;


const logOn = schedule.scheduleJob('0 0 4 * * 3', function(){
    console.log("It's Wednesday My Dudes!")
    client.login(token);
});

const logOut = schedule.scheduleJob('0 30 21 * * 3', function(){
    console.log("Wednesday's Over My Dudes!")
    client.destroy();
});

const postWednesdayMessage = schedule.scheduleJob('0 10 8 * * 3', function(){
    console.log("Reminding the Bois it's wednesday.")
    if(!loggedin){client.login(token);}
    client.channels.cache.get(generalChatID).send(`It's Wednesday My Dudes!`);
});

const postWednesdayMeme = schedule.scheduleJob('0 40 11 * * 3', function(){
    console.log("Meme Time");
    if(!loggedin){client.login(token);}
    client.channels.cache.get(generalChatID).send(`https://www.youtube.com/watch?v=OzQ-KvxLVT0`);
});

client.on('ready', () => {
    console.log('Ready for Wednesday my dude?');
    loggedin = true;
});
