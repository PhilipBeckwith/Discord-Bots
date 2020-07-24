const schedule = require('node-schedule-tz')
const discord = require('discord.js');
const getWednesdayMeme = require('./utils/utils');
const {generalChatID, testMode, StagingID} = require('./config.json');

let timezone = 'America/Phoenix';

let token = process.env.BUDGETT_TOKEN
const client = new discord.Client();
var loggedin = false;


const logOn = schedule.scheduleJob('log on', '0 0 4 * * 3', timezone, function(){
    console.log("It's Wednesday My Dudes!")
    client.login(token);
});

const logOut = schedule.scheduleJob('log out', '0 30 21 * * 3', timezone, function(){
    console.log("Wednesday's Over My Dudes!")
    client.destroy();
});

const postWednesdayMessage = schedule.scheduleJob('post wednesday message', '0 10 9 * * 3', timezone, function(){
    console.log("Reminding the Bois it's wednesday.")
    if(!loggedin){client.login(token);}
    client.channels.cache.get(generalChatID).send(`It's Wednesday My Dudes!`);
});

const postWednesdayMeme = schedule.scheduleJob('post wednesday meme', '0 40 11 * * 3', timezone, function(){
    console.log("Meme Time");
    if(!loggedin){client.login(token);}
    getWednesdayMeme()
        .then(meme => client.channels.cache.get(generalChatID).send(meme))
});

client.on('ready', () => {
    console.log('Ready for Wednesday my dude?');
    if(process.env.ENVIRONMENT == 'STAGING'){
        console.log("Are you ready kids?")
        getWednesdayMeme()
            .then(meme => client.channels.cache.get(StagingID).send(meme))
    }
    loggedin = true;
});

client.login(token);

console.log('It\'s wednesday');
