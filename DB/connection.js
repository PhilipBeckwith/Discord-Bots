const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const url = process.env.DB_CONN_STRING
const dbName = process.env.DB_NAME
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })


async function GetMongoDB(){
    await client.connect()
    return client.db(dbName)
}

module.exports = {
    GetMongoDB
}