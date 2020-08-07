var commands = [];

//Simple command register. Allows for reuse of code and ease of adding in new commands
// - keyword: is the command keyword than spawns the action - TODO: create a way to receive arguments
// - helptext: is the text that will show up when the user calls the /help command. This should describe what the command does and how the user should use it.
// - action: is the function that is called when the keyword is typed in chat. Action function is of the form function(msg) with msg being the discord msg that spawned the command.
// - preserve: should the command message be deleted after being called? Set true to preserve default behavior is to delete command message.
function registerCommand(context, commandOptions){
  commands.add({
    context: context,
    keyword: commandOptions.keyword,
    helptext: commandOptions.helptext,
    action: commandOptions.action,
    preserve: commandOptions.preserve
  });
}

function registerCommands(context, commandArray){
  commandArray.forEach(command => registerCommand(context, command) );
}

function registerHelp() {
  registerCommand(undefined, {
    keyword: '/help',
    helptext: 'When you are a noob and need to reference the commands',
    action: help
  });
}

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
//  TODO - allow to discriminate between different command contexts
//  TODO - Show information about arguments
function help(msg){
  var reply = `Looks like ${msg.member} is an idiot and needs guidence on the commands: \n\n`;
  commands.forEach(command => {
    reply += "Command: " + command.keyword + `\n`;
    reply += command.helptext + `\n\n`
  });

  msg.channel.send(reply);
}


function attachToBot(bot) {

  // Command Processing. Cleans up commands after they have been issued
  bot.on('message', msg => {
    if (!msg.guild) return;

    commands.forEach(command => {
      if(msg.content.startsWith(command.keyword)){
        command.action(msg);
        if(!command.preserve) {
          msg.delete();
        }
      }
    });

  });
}

