const newRelic = require('newrelic');
const users = require('./Users.json')
const templates = require('./Template.json')
const twilioConfig = require('./TwilioConfig.json')
const twilioClient = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID, 
  process.env.TWILIO_AUTH_TOKEN, { 
  lazyLoading: true 
})

String.prototype.interpolate = function(params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${this}\`;`)(...vals);
}

var commands = [{
  keyword: '/SayHi',
  helptext: 'Just tell me who, and I will go say Hi!',
  action: introductionCall
},{
  keyword: '/page',
  helptext: 'Calls members and invites them to play',
  action: pageFriend
},{
  keyword: '/call',
  helptext: 'calls someone with whatever you want',
  action: customCall
}];

function getName(user){
  let NAME_KEY = user.concat('_NAME');
  return process.env[NAME_KEY];
}

function getNumber(user){
  let PHONE_KEY = user.concat('_PHONE');
  return process.env[PHONE_KEY];
}

function introductionCall(user, text){
  let name = getName(user);
  return message = templates.Introduction.interpolate({
    NAME: name
  });
}

function pageFriend(user, text){
  let name = getName(user);
  return templates.RequestGame.interpolate({
    NAME: name
  });
}

function customCall(user, text){
  const message = text.match(/\[(.*)]/)[1];
  return templates.Call.interpolate({
    MESSAGE: message
  });
}

function makeCall(callConfig){
  twilioClient.calls.create(callConfig)
  .then(call => console.log(call.sid));
}


module.exports = function(bot) {

  bot.on('ready', () => {
    console.info(`Page-Bot logged in as ${bot.user.tag}!`);
  });
  
  bot.on("message", msg => {
    commands.forEach(command => {
      if(msg.content.startsWith(command.keyword)){
        let mentions = msg.mentions.users.map(user => user.id)
        mentions.forEach(id => {
          var call = twilioConfig;
          call.twiml = command.action(users[id], msg.content);
          call.to = getNumber(users[id]);
          makeCall(call);
        })
      }
    });
  });

}
