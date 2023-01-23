function func(){
    return 'funciton'
}


async function asyncfunc(){
    return 'async funciton'
}

function funcwithArg(blah, blah2, blah3){
    return `${blah}-${blah2}-${blah3}`
}

console.log('list all funcions')
Object.keys(window)

module.exports={
    func, asyncfunc, funcwithArg
}
