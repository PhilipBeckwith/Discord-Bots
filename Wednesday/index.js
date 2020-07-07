const schedule = require('node-schedule')
const discord = require('discord.js');
const client = new discord.Client();



client.on('ready', () => {
    console.log('Is it Wednesday my dude?');
});

client.login(token);
