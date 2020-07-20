const {
  LOOPDELAY, // Delays the watch loop on the server by milliseconds to reduce server overhead. larger delay is less responsive.
  GREETING_DELAY // Give some time before the greeting is played to allow the user to connect to the voice chat successfully.
} = require('./config.json');

const Discord = require('discord.js');
const EventEmitter = require('events');
const path = require('path');
const bot = new Discord.Client();

const TOKEN = process.env.SCREECHBOT_TOKEN;

bot.login(TOKEN);

//Custom event emitter for capturing events from the watch loop
class VoiceEmitter extends EventEmitter {}
voiceChat = new VoiceEmitter();

//Simple command register. Allows for reuse of code and ease of adding in new commands
// - keyword: is the command keyword than spawns the action - TODO: create a way to receive arguments
// - helptext: is the text that will show up when the user calls the /help command. This should describe what the command does and how the user should use it.
// - action: is the function that is called when the keyword is typed in chat. Action function is of the form function(msg) with msg being the discord msg that spawned the command.
var commands = [{
  keyword: '/help',
  helptext: 'When you are a noob and need to reference the commands',
  action: help
},{
  keyword: '/screech',
  helptext: 'Because fuck everyone on the voice channel',
  action: playAudio(path.resolve(__dirname, "audio/screech.mp3"), true)
},{
  keyword: '/greeting',
  helptext: 'Nice way to say hello',
  action: playAudio(path.resolve(__dirname, "audio/greetings_traveler.mp3"), false)
},{
  keyword: '/join',
  helptext: 'Bot will join the voice channel you are on',
  action: join
},{
  keyword: '/leave',
  helptext: 'Bot GTFO the voice channel',
  action: leave
},{
  keyword: '/watch',
  helptext: 'Stalk the voice channel and greet new comers',
  action: watch
}];


bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

// Command Processing. Cleans up commands after they have been issued
bot.on('message', msg => {
  if (!msg.guild) return;

  commands.forEach(command => {
    if(msg.content === command.keyword){
      command.action(msg);
      msg.delete();
    }
  });

});

//Help text generation. Appears in the following format:
//
// Looks like {@user} is an idiot and needs guidence on the commands:
//
// Command: {keyword}
// {helptext}
//
// Next command etc...
//
//  - msg: the message object from discord https://discord.js.org/#/docs/main/stable/class/Message
function help(msg){
  var reply = `Looks like ${msg.member} is an idiot and needs guidence on the commands: \n\n`;
  commands.forEach(command => {
    reply += "Command: " + command.keyword + `\n`;
    reply += command.helptext + `\n\n`
  });

  msg.channel.send(reply);
}

//The bot will join the voice channel that the command giver is currently on and then proceed to play an audio file or stream.
// - audio: The file or stream to play - see https://discord.js.org/#/docs/main/stable/class/VoiceConnection?scrollTo=play
// - leave: boolean for if the bot should leave the voice channel after playing audio.
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

// Connects the bot to the voice channel that the command giver is on
function join(msg){
  // Only try to join the sender's voice channel if they are in one themselves
  if (msg.member.voice.channel) {
    msg.member.voice.channel.join();
  } else {
    msg.reply('You need to join a voice channel for me to follow');
  }
}


// Disconnects the bot from the voice channel that the command giver is on
function leave(msg){
  // Only try to leave the sender's voice channel if they are in one themselves
  if (msg.member.voice.channel) {
    msg.member.voice.channel.leave();
    msg.reply('Fine I will get off!');
  } else {
    msg.reply('You need to join a voice channel I am in to tell me to leave!');
  }
}

// Sets the bot into a watchloop for the current voice channel that the command giver is on
function watch(msg){
  if (msg.member.voice.channel) {
    channelWatchLoop(msg);
  } else {
    msg.reply('You need to join a voice channel first!');
  }
}


// Loops over watching the voice channel of the command giver. emits voiceChat events when voice channel state changes.
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

// Plays a greeting to members as new people join the voice chat.
voiceChat.on('memberJoin', (connection) => {
  setTimeout(() => {
    const dispatcher = connection.play(path.resolve(__dirname, 'audio/brit_greeting.mp3'));
    dispatcher.on("error", console.error);
  }, GREETING_DELAY);
});
