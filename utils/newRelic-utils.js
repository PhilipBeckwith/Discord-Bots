const logger = require('./logger').getLogger('newRelicUtils')
const newRelic = require('newrelic')

const AsyncFunction = (async()=>{}).constructor

function instrementSegment(method){
    if(method.segmentInstrumented){
        logger.warn(`${method.name} is already an instrumented segment...`)
        return method;
    }

    const instrementedMethod = method instanceof AsyncFunction ? 
        wrapAsyncSegment(method) :
        wrapSynchronousSegment(method);

    instrementedMethod.segmentInstrumented = true;
    Object.defineProperty(instrementedMethod, 'name', {
        value: method.name,
        writable: false
      });

    return instrementedMethod;
}

function wrapSynchronousSegment(method){
    logger.info(`Instrumenting synchronous Segment ${method.name}`)
    return function(){
        return newRelic.startSegment(method.name, true, ()=>{
            logger.info(`Starting Segment ${method.name}`)
            return method(...arguments)
        })
    }
}

function wrapAsyncSegment(method){
    logger.info(`Instrumenting Async Segment ${method.name}`)
    return async function(){
        return newRelic.startSegment(method.name, true, async ()=>{
            logger.info(`Starting Segment ${method.name}`)
            return await method(...arguments)
        })
    }
}

function instrementBackgroundTransaction(method){
    if(method.transactionInstrumented){
        logger.warn(`${method.name} is already an instrumented transaction...`)
        return method;
    }

    if(method.segmentInstrumented){
        logger.warn(`${method.name} is already an instrumented segment. This might cause unexpected behavour.`)
    }

    logger.info(`Instrumented Method ${method.name}`)
    const instrementedMethod = method instanceof AsyncFunction ? 
        wrapAsyncTransaction(method) :
        wrapSynchronousTransaction(method);

    instrementedMethod.transactionInstrumented = true;
    Object.defineProperty(instrementedMethod, 'name', {
        value: method.name,
        writable: false
      });

    return instrementedMethod;
}

function wrapSynchronousTransaction(method){
    logger.info(`Instrumenting synchronous Transaction ${method.name}`)
    return function(){
        return newRelic.startBackgroundTransaction(
            method.name, () => {
                logger.info(`Starting Transaction ${method.name}`)
                return method(...arguments)
        })
    }
}

function wrapAsyncTransaction(method){
    logger.info(`Instrumenting Async Transaction ${method.name}`)
    return async function(){
        return newRelic.startBackgroundTransaction(
            method.name, async () => {
                logger.info(`Starting Transaction ${method.name}`)
                return await method(...arguments)
        })
    }
}

module.exports = {
    instrementSegment: instrementSegment,
    instrementBackgroundTransaction: instrementBackgroundTransaction
}