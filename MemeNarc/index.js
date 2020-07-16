const {
    prefix, 
    id, userName,
    memeChatName, memeChatID,
    botScriptChatName, botScriptChatID,
    testMode
} = require('./config.json');
const discord = require('discord.js');
const client = new discord.Client();

let token = process.env.MEME_NARC_TOKEN
const regex = '(https:\/\/)?(9gag\.com\/gag\/).*'

let targetChatID;
let targetChatName;

client.on('ready', () => {
    if(testMode == 'true'){
        targetChatID = botScriptChatID;
        targetChatName = botScriptChatName;
    }else{
        targetChatID = memeChatID;
        targetChatName = memeChatName;
    }
    console.log('Up and Sweeping away!');
});

client.on("message", message => {
    console.log(message);
    if(message.author.bot == false) { //Any bot can post memes
        if(message.channel.id != targetChatID && message.channel.name != targetChatName){ // Won't repost to same chat
            if(message.content.match(regex)){
                client.channels.resolveID()
                client.channels.cache.get(targetChatID).send(
                    `${message.author.username} Posted a Meme On ${message.channel.name}:\n${message.content}`
                    );
                console.log("Message from Re-Homed")
                message.delete();
                console.log("Mess cleaned.")
                }
        }
    }
})

client.login(token);
