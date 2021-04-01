const newRelic = require('newrelic');
const templates = require('./Template.json')
const twilioConfig = require('./TwilioConfig.json')
const twilioClient = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID, 
  process.env.TWILIO_AUTH_TOKEN, { 
  lazyLoading: true 
})

const users = JSON.parse(process.env.USER_ID_JSON);

var commands = [
  {
  keyword: '/SayHi',
  helptext: 'Just tell me who, and I will go say Hi!',
  action: function(msg){
    processCall(msg, introductionCall)
  }
},
{
  keyword: '/page',
  helptext: 'Calls members and invites them to play',
  action:  function(msg){
    processCall(msg, pageFriend)
  }
},{
  keyword: '/call',
  helptext: 'calls someone with whatever you want',
  action:  function(msg){
    processCall(msg, customCall)
  }
}];

function getName(user){
  let NAME_KEY = user.concat('_NAME');
  return process.env[NAME_KEY];
}

function getNumber(user){
  let PHONE_KEY = user.concat('_PHONE');
  return process.env[PHONE_KEY];
}

function getTwilioNumber(){
  return process.env.TWILIO_PHONE_NUMBER;
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
  const message = text.match(/\[(.*)]/);
  let name = getName(user);
  return message ?
   templates.Call.interpolate({
    MESSAGE: message[1]
  }) :
  templates.ERROR.interpolate({
    NAME: name
  });
}

async function processCall(msg, templateFormatter){
    let mentions = msg.mentions.users.map(user => user.id)

    for(const memberID of mentions){
      let call = await createCall(memberID, msg, templateFormatter)
      await makeCall(call);
    }
}

async function createCall(memberID, msg, templateFormatter){
  let call = twilioConfig;
  call.twiml = templateFormatter(users[memberID], msg.content);
  call.from = getTwilioNumber();
  call.to = getNumber(users[memberID]);
  return call;
}

async function makeCall(callConfig){
  let call = await twilioClient.calls.create(callConfig)
  console.log(call.sid);
}

String.prototype.interpolate = function(params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${this}\`;`)(...vals);
}

module.exports = {
  commands: commands
}
