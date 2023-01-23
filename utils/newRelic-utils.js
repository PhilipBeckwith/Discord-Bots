const logger = require('./logger').getLogger('newRelicUtils')
const newRelic = require('newrelic')

function instrementMethod(method){
    if(method.instrumented){
        logger.warn(`${method.name} is already instrumented...`)
        return method;
    }

    logger.info(`Instrumented Method ${method.name}`)
    const instrementedMethod = function(){
        return newRelic.startSegment(method.name, true, ()=>{
            return method(...arguments)
        })
    }

    instrementMethod.instrumented = true;
    Object.defineProperty(instrementMethod, 'name', {
        value: method.name,
        writable: false
      });

    return instrementedMethod;
}

function instrementModule(module) {
    logger.info(module.name)
    Object.keys(module).forEach(key=>{
        blah[key] = instrementMethod(blah[key])
    })

    return module;
}

module.exports = {
    instrementMethod: instrementMethod,
    instrementModule: instrementModule
}