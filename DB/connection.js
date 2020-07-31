const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const url = process.env.DB_CONN_STRING
const dbName = process.env.DB_NAME
var client 


async function GetMongoDB(){
    client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
    await client.connect()
    return client.db(dbName)
}

function CloseMongoDB(){
    client.close();
}

module.exports = {
    GetMongoDB,
    CloseMongoDB
}