const newRelic = require('newrelic')

function instrementMethod(method){
    if(method.instrumented){
        console.log(`${method.name} is already instrumented...`)
        return method;
    }

    console.log(`Instrumented Method ${method.name}`)
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
    console.log(module.name)
    Object.keys(module).forEach(key=>{
        blah[key] = instrementMethod(blah[key])
    })

    return module;
}

module.exports = {
    instrementMethod: instrementMethod,
    instrementModule: instrementModule
}