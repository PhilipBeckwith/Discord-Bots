const logger = require('../../utils/logger')('Slash-Command-Handler')
const {Events, REST, Routes} = require('discord.js');
const {instrementMethod} = require('../../utils/newRelic-utils')

const slashCommands = {}

function registerSlashCommands(botSlashCommands){
    Object.keys(botSlashCommands).forEach(key => {
        botSlashCommands[key].execute = instrementMethod(botSlashCommands[key].execute)
    })
    Object.assign(slashCommands, botSlashCommands)
}

function executeCommand(interaction){
    logger.info('Interaction started')
    if (!interaction.isChatInputCommand()) return;

    if(slashCommands[interaction.commandName])
    slashCommands[interaction.commandName].execute(interaction)
}

async function publishSlashCommands(token, applicationId, guildId){
	try {
        const commandMetadata = Object.values(slashCommands).map(command => command.data)
        const restClient = new REST({ version: '10' }).setToken(token);
		logger.info(`Started refreshing ${commandMetadata.length} application (/) commands.`);

		const data = guildId ? 
            await postToGuild(restClient, commandMetadata, applicationId, guildId) :  
            await postGlobally(restClient, commandMetadata, applicationId);

            logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		logger.warn(error);
	}
}

async function postGlobally(restClient, commandMetadata, applicationId){
    return await restClient.put(
        Routes.applicationCommands(applicationId),
        { body: commandMetadata },
    );
}

async function postToGuild(restClient, commandMetadata, applicationId, guildId){
    return await restClient.put(
        Routes.applicationGuildCommands(applicationId, guildId),
        { body: commandMetadata },
    );
}

function registerInteractionListener(discordClient){
    discordClient.on(Events.InteractionCreate, executeCommand);
}

registerSlashCommands = instrementMethod(registerSlashCommands)
executeCommand = instrementMethod(executeCommand)
publishSlashCommands = instrementMethod(publishSlashCommands)
postGlobally = instrementMethod(postGlobally)
postToGuild = instrementMethod(postToGuild)
registerInteractionListener = instrementMethod(registerInteractionListener)

module.exports = {
    registerSlashCommands,
    registerInteractionListener, 
    publishSlashCommands,
}