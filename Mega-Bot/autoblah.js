const {instrementMethod} = require('./utils/newRelic-utils')
let  blah = require('./testwrapers')

function instrementModule(module) {
    console.log(module.name)
    Object.keys(module).forEach(key=>{
        blah[key] = instrementMethod(blah[key])
        blah[key].isinstremented = true;
    })
}

instrementModule(blah)