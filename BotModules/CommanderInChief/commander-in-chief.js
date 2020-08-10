var commands = [];

//Simple command register. Allows for reuse of code and ease of adding in new commands
// - keyword: is the command keyword than spawns the action
// - helptext: is the text that will show up when the user calls the /help command. This should describe what the command does and how the user should use it.
// - action: is the function that is called when the keyword is typed in chat. Action function is of the form function(msg) with msg being the discord msg that spawned the command.
// - preserve: should the command message be deleted after being called? Set true to preserve default behavior is to delete command message.
function registerCommand(context, commandOptions){
  commands.push({
    context: context,
    keyword: commandOptions.keyword,
    helptext: commandOptions.helptext,
    action: commandOptions.action,
    preserve: commandOptions.preserve,
    args: commandOptions.args
  });
}

function registerCommands(context, commandArray){
  commandArray.forEach(command => registerCommand(context, command) );
}

function registerHelp() {
  registerCommand(undefined, {
    keyword: '/help',
    helptext: 'When you are a noob and need to reference the commands',
    action: help,
    args: [{
      index: 1,
      helptext: 'Include context to filter help commands displayed. "/help <context>" will display the command documentation for that context. Call "/help all" to see all commands or "/help list" to list all contexts.'
    }]
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
function help(msg, args){
  var reply = `Looks like ${msg.member} is an idiot and needs guidence on the commands: \n\n`;
  var filterContext = args.raw[1] ? args.raw[1].toUpperCase() : undefined;

  var contexts = Array.from(new Set(commands.map(command => command.context))).sort();

  switch(filterContext){
    case 'ALL':
      printAll();
      break;
    case 'LIST':
      printListOfContexts();
      break;
    default:
      printContext(filterContext);
      break;
  }

  function printAll(){
    printContext(undefined);

    contexts.forEach(context => {
      if(context) printContext(context);
    });
  }

  function printListOfContexts(){
    reply += "```asciidoc" + `\n`;
    reply += "Contexts" + `\n`;
    reply += "=====" + `\n`;
    contexts.forEach(context => {
      if(context) reply += "- " + context + `\n`;
    });
    reply += "```" + `\n`;
  }

  function printContext(context){
    reply += "```asciidoc" + `\n`;
    if(context) reply += context + `\n`;
    if(context) reply += "=====" + `\n`;
    //else        reply += "Base Commands: " + `\n`;
    commands.filter(command => CaseInsensitive(command.context) == CaseInsensitive(context)).forEach(printCommand);
    reply += "```" + `\n`;
  }

  function CaseInsensitive(input){
    return input ? input.toUpperCase() : undefined;
  }

  function printCommand(command){
    reply += "Command :: " + command.keyword + `\n`;
    reply += " - " +command.helptext + `\n`
    if(command.args){
      command.args.forEach(printArg);
    }
    reply += `\n`
  }

  function printArg(arg){
    reply += `\t* ` + "arg: " + (arg.index ? arg.index : arg.keyword) + `\n`;
    reply += `\t  ` + arg.helptext + `\n`
  }

  msg.channel.send(reply);
}


function attachToBot(bot) {

  registerHelp();

  // Command Processing. Cleans up commands after they have been issued
  bot.on('message', msg => {
    if (!msg.guild) return;

    commands.forEach(command => {
      if(msg.content.startsWith(command.keyword)){
        var args = extractArgs(command, msg);
        command.action(msg, args);
        if(!command.preserve) {
          msg.delete();
        }
      }
    });

  });
}

function extractArgs(command, msg){
  var args = {};
  args.raw = [];

  args.raw = msg.content.match(/\\?.|^$/g).reduce((p, c) => {
    if(c === '"'){
      p.quote ^= 1;
    }else if(!p.quote && c === ' '){
      p.a.push('');
    }else{
      p.a[p.a.length-1] += c.replace(/\\(.)/,"$1");
    }
    return  p;
  }, {a: ['']}).a
  //   do {
  //     var match = /[^\s"]+|"([^"]*)"/gi.exec(msg.content);
  //     console.log(match);
  //     if(match != null) {
  //       args.raw.push(match[1] ? match[1] : match[0]);
  //       console.log(args.raw);
  //     }
  //   } while (false);
  //} while (match != null);
  console.log(args.raw);

  if(command.args){
    command.args.forEach((arg) => {
      var index = arg.index ? arg.index : args.raw.indexOf(arg.keyword)+1;
      args[arg] = index > 0 ? args.raw[index] : undefined;
    });
  }

  return args;
}

module.exports = {
  registerCommand,
  registerCommands,
  attachToBot
}
