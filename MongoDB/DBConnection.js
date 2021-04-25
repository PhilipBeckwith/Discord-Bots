const mongoose = require('mongoose')

const DBConnectionString = process.env.DB_CONN_STRING

async function OpenDBConnection(){
    try{
        await mongoose.connect(DBConnectionString, {useUnifiedTopology: true, useNewUrlParser: true})
    }
    catch(error){
        console.log(error)
    }
}

async function CloseDBConnection(){
    mongoose.connection.close()
}

process.on('exit', () =>{
    CloseDBConnection()
        .then(console.log("Closing DB Connection"))
})

OpenDBConnection()