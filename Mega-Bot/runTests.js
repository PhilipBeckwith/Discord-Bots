require('./autoblah')
const  {
    func, asyncfunc, funcwithArg
} = require('./testwrapers')


async function runTests(){
    console.log(func)

    console.log(func())
    console.log(await asyncfunc())
    console.log(funcwithArg('one', 'last', 'test'))
}

runTests()