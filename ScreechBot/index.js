const {
  LOOPDELAY,
  GREETING_DELAY
} = require('./config.json');

const Discord = require('discord.js');
const EventEmitter = require('events');
const path = require('path');
const bot = new Discord.Client();

const TOKEN = process.env.SCREECHBOT_TOKEN;

bot.login(TOKEN);

class VoiceEmitter extends EventEmitter {}
voiceChat = new VoiceEmitter();

var commands = [{
  text: '/help',
  helptext: 'When you are a noob and need to reference the commands',
  action: help
},{
  text: '/screech',
  helptext: 'Because fuck everyone on the voice channel',
  action: playAudio(path.resolve(__dirname, "audio/screech.mp3"), true)
},{
  text: '/greeting',
  helptext: 'Nice way to say hello',
  action: playAudio(path.resolve(__dirname, "audio/greetings_traveler.mp3"), false)
},{
  text: '/leave',
  helptext: 'Bot GTFO the voice channel',
  action: leave
},{
  text: '/watch',
  helptext: 'Stalk the voice channel and greet new comers',
  action: watch
}];


bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (!msg.guild) return;

  commands.forEach(command => {
    if(msg.content === command.text){
      command.action(msg);
      msg.delete();
    }
  });

});

function help(msg){
  var reply = `Looks like ${msg.member} is an idiot and needs guidence on the commands: \n\n`;
  commands.forEach(command => {
    reply += "Command: " + command.text + `\n`;
    reply += command.helptext + `\n\n`
  });

  msg.channel.send(reply);
  msg.delete();
}

function playAudio(audio, leave){
  return function(msg){
    if (msg.member.voice.channel) {
      msg.member.voice.channel.join().then(connection =>{
        const dispatcher = connection.play(audio);
        if(leave){
          dispatcher.on("finish", end => {msg.member.voice.channel.leave();});
        }
        dispatcher.on("error", console.error);
      }).catch(err => console.log(err));
    } else {
      msg.reply('You need to join a voice channel first!');
    }
  }
}

function leave(msg){
  // Only try to join the sender's voice channel if they are in one themselves
  if (msg.member.voice.channel) {
    msg.member.voice.channel.leave();
    msg.reply('Fine I will get off!');
  } else {
    msg.reply('You need to join a voice channel I am in to tell me to leave!');
  }
}

function watch(msg){
  if (msg.member.voice.channel) {
    channelWatchLoop(msg);
  } else {
    msg.reply('You need to join a voice channel first!');
  }
}


function channelWatchLoop(msg){
  var voiceChannel = msg.member.voice.channel;
  voiceChannel.join()
    .then(connection => { // Connection is an instance of VoiceConnection
      msg.reply('I have successfully connected to the channel and am now stalking you!');
      var old_members = voiceChannel.members.array().length;
      var condition = true;
      (function eventChecks(){
        if(condition === true){
          if(voiceChannel.members) {
            new_members = voiceChannel.members.array().length;
            if(new_members > old_members){
              voiceChat.emit('memberJoin', connection);
            }
            if(new_members < old_members){
              voiceChat.emit('memberLeave', connection);
            }
            // Leave Watch Loop if only one in chat
            if(new_members === 1) condition = false;
            // Kill loop if bot is no longer in chat
            var me = voiceChannel.members.get(bot.user.id);
            if(!me) condition = false;
            old_members = new_members;
          }
          setTimeout(eventChecks, LOOPDELAY);
        } else {
          voiceChat.emit('end', voiceChannel);
          voiceChannel.leave();
        }
      })();
    })
    .catch(console.log);
}

voiceChat.on('memberJoin', (connection) => {
  setTimeout(() => {
    const dispatcher = connection.play(path.resolve(__dirname, 'audio/brit_greeting.mp3'));
    dispatcher.on("error", console.error);
  }, GREETING_DELAY);
});
