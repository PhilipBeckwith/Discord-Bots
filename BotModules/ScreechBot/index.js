// Delays the watch loop on the server by milliseconds to reduce server overhead. larger delay is less responsive.
const LOOPDELAY = process.env.SCREECHBOT_LOOPDELAY ? process.env.SCREECHBOT_LOOPDELAY : 100;
// Give some time before the greeting is played to allow the user to connect to the voice chat successfully.
const GREETING_DELAY = process.env.SCREECHBOT_GREETING_DELAY ? process.env.SCREECHBOT_GREETING_DELAY : 2000;

const EventEmitter = require('events');
const path = require('path');

module.exports = function(bot) {
  //Custom event emitter for capturing events from the watch loop
  class VoiceEmitter extends EventEmitter {}
  voiceChat = new VoiceEmitter();

  var commands = [{
    keyword: '/screech',
    helptext: 'Because fuck everyone on the voice channel',
    action: playAudio(path.resolve(__dirname, "audio/screech.mp3"), true),
    autoCleanup: true
  },{
    keyword: '/greeting',
    helptext: 'Nice way to say hello',
    action: playAudio(path.resolve(__dirname, "audio/greetings_traveler.mp3"), false),
    autoCleanup: true
  },{
    keyword: '/join',
    helptext: 'Bot will join the voice channel you are on',
    action: join,
    autoCleanup: true
  },{
    keyword: '/leave',
    helptext: 'Bot GTFO the voice channel',
    action: leave,
    autoCleanup: true
  },{
    keyword: '/watch',
    helptext: 'Stalk the voice channel and greet new comers',
    action: watch,
    autoCleanup: true
  }];


  bot.on('ready', () => {
    console.info(`Screechbot logged in as ${bot.user.tag}!`);
  });


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
        var continueLoop = true;
        (function eventChecks(){
          if(continueLoop){
            if(voiceChannel.members) {
              new_members = voiceChannel.members.array().length;
              if(new_members > old_members){
                voiceChat.emit('memberJoin', connection);
              }
              if(new_members < old_members){
                voiceChat.emit('memberLeave', connection);
              }
              // Leave Watch Loop if only one in chat
              if(new_members === 1) continueLoop = false;
              // Kill loop if bot is no longer in chat
              var me = voiceChannel.members.get(bot.user.id);
              if(!me) continueLoop = false;
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

  return {
    commands
  }
}
