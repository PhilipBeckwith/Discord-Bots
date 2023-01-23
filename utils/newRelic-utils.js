const logger = require('./logger').getLogger('newRelicUtils')
const newRelic = require('newrelic')

function instrementSegment(method){
    if(method.segmentInstrumented){
        logger.warn(`${method.name} is already an instrumented segment...`)
        return method;
    }

    logger.info(`Instrumented Method ${method.name}`)
    const instrementedMethod = function(){
        return newRelic.startSegment(method.name, true, ()=>{
            return method(...arguments)
        })
    }

    instrementedMethod.segmentInstrumented = true;
    Object.defineProperty(instrementedMethod, 'name', {
        value: method.name,
        writable: false
      });

    return instrementedMethod;
}

function instrementBackgroundTransaction(method){
    if(method.transactionInstrumented){
        logger.warn(`${method.name} is already an instrumented transaction...`)
        return method;
    }

    logger.info(`Instrumented Method ${method.name}`)
    const instrementedMethod = function(){
        return newrelic.startBackgroundTransaction(
            method.name, ()=>{
            return method(...arguments)
        })
    }

    instrementedMethod.transactionInstrumented = true;
    Object.defineProperty(instrementedMethod, 'name', {
        value: method.name,
        writable: false
      });

    return instrementedMethod;
}

module.exports = {
    instrementSegment: instrementSegment,
    instrementBackgroundTransaction: instrementBackgroundTransaction
}