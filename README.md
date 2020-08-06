# Discord-Bots

## Budgett
Named after the "it's Wednsesday my dude" frog.

This bot
+ loggs in on Wednesday
+ posts "It's Wednesday My Dudes." in the morning
+ posts a wednesday video in the afternoon
+ Loggs out before thursday

#### Work to be added
Add an array of new vidos for the bot to post or give the bot a way to find videos itself.

## Megabot
This is a framework bot for holding other bot modules without having to run a seperate bot token for each of them. The following bots are submodules of megabot.

### MemeNarc
Removes Memes that weren't put in a meme chat.

### ScreechBot
Has several chat commands including /screech which will have the bot screech into the voice chat. Primarily hangs in voice chat and greets newcomers.

Use /help to list available commands when running

### SteamBot
Interfaces with MongoDB Instance to find common games between users in channel.

Use /pickgame @user @user to choose a single game shared by mentioned users 

Use /games @user @user to print a list of all shared games between mentioned users