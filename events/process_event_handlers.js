const newRelic = require('newrelic')
const logger = require('../utils/logger').getLogger('Process Event Handlers.')

process.once('uncaughtException', (err, origin) => {
    newRelic.noticeError(err)
    logger.error(`Uncaught Exception, ${err} : ${origin}`)
    process.exit(-1)
});

process.once('unhandledRejection', (reason, promise) => {
    newRelic.noticeError(reason)
    logger.error(`Unhandled Rejection, ${reason} : ${promise}`)
    process.exit(-1)
});

process.once('beforeExit', (code) => {
    newRelic.noticeError(new Error(`Server Shutting Down: ${code}`))
    logger.error(`Server Shutting Down', ${code}`)
    process.exit(code)
});
