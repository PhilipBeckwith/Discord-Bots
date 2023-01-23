const { createLogger, format, transports} = require('winston');
const { combine, timestamp, colorize, json } = format;

function getLogger(serviceName, metadata = {}){
    const logger = createLogger({
        format: combine(
            timestamp(),
            json()
        ),
        defaultMeta: Object.assign( metadata, {
            service: serviceName
        }),
        transports: [new transports.Console({
            format: combine(
                colorize()
            )
        })]
      })

      return logger;
}

module.exports = {
    getLogger
}