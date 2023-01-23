const logger = require('../../utils/logger').getLogger('twillio')
const {callConfig, templates} = require('./configs/TwilioConfig.json')
const { SlashCommandBuilder, Options } = require('discord.js');
const twilioClient = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID, 
  process.env.TWILIO_AUTH_TOKEN, { 
  lazyLoading: true 
})

const USER_ID_REGEX = /<@(?<userId>\d*)>/g
const users = JSON.parse(process.env.USER_ID_JSON);

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
  console.warn('Introduction Call. (Deprecated...)')
  let name = getName(user);
  return message = templates.Introduction.interpolate({
    NAME: name
  });
}

function pageFriend(user, text){
  logger.info('Paging user.')
  let name = getName(user);
  return templates.RequestGame.interpolate({
    NAME: name
  });
}

function customCall(user, message){
  logger.info('Making Custom Call.')
  let name = getName(user);
  return message ?
   templates.Call.interpolate({
    MESSAGE: message
  }) :
  templates.ERROR.interpolate({
    NAME: name
  });
}

function getUserIds({options}){
  const user = options.getUser('user')
  const members = options.getString('members')

  if(user)
    return [user.id]

  if(members)
    return [...members.matchAll(USER_ID_REGEX)]
      .map(match => match.groups.userId)

  return [];
}

function replyToInteraction(members, interaction){
  const message = (!members || members.length ===0) ? 
    'Could not find any members in command':
    `Calling <@${members.join('>, <@')}>`;

  interaction.reply({ content: message, ephemeral: (!members || members.length ===0) });
}

async function processCall(templateFormatter, interaction){
  const members = getUserIds(interaction)
  const message = interaction.options.getString('message')

  replyToInteraction(members, interaction)

  for(const memberID of members){
    let call = await createCall(memberID, message, templateFormatter)
    await makeCall(call);
  }
}

async function createCall(memberID, message, templateFormatter){
  let call = callConfig;
  call.twiml = templateFormatter(users[memberID], message);
  call.from = getTwilioNumber();
  call.to = getNumber(users[memberID]);
  return call;
}

async function makeCall(callConfig){
  let call = await twilioClient.calls.create(callConfig)
  console.log(`Making Call id: ${call.sid}`);
}

String.prototype.interpolate = function(params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${this}\`;`)(...vals);
}

const hello = {
  execute: processCall.bind(null, introductionCall),
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Send a very pointless Automated Phonecall to people you want to anoy.')
    .addUserOption(option => option
      .setName('user')
      .setDescription(`Select a user to call. (Takes Priority over Members)`))
    .addStringOption(option => option
      .setName('members')
      .setDescription(`@ Multiple people and they'll all get called.`)
      .setMaxLength(200))
}

const page = {
  execute: processCall.bind(null, pageFriend),
  data: new SlashCommandBuilder()
    .setName('page')
    .setDescription('Summon Friends Via automated Phone call.')
    .addUserOption(option => option
      .setName('user')
      .setDescription(`Select a user to call. (Takes Priority over Members)`))
    .addStringOption(option => option
      .setName('members')
      .setDescription(`@ Multiple people and they'll all get paged.`)
      .setMaxLength(200))
}

const call = {
  execute: processCall.bind(null, customCall),
  data: new SlashCommandBuilder()
    .setName('call')
    .setDescription('Automated Phone call with a custom message.')
    .addUserOption(option => option
      .setName('user')
      .setDescription(`Select a user to call. (Takes Priority over Members)`))
    .addStringOption(option => option
      .setName('members')
      .setDescription(`@ Multiple people and they'll all get called.`)
      .setMaxLength(200))
    .addStringOption(option => option
      .setName('message')
      .setDescription(`The message you'd like your friend(s) to recieve.`)
      .setMaxLength(200))
}

const slashCommands = {page, call, hello}

module.exports = {
  slashCommands: slashCommands
}
