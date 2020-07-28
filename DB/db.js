const mongodb = require('mongodb')

DBInit = async () =>{
    const MongoClient = mongodb.MongoClient
    const url = process.env.DB_CONN_STRING
    const dbName = process.env.DB_NAME
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
    await client.connect()
    const db = await client.db(dbName)
    return db
};

module.exports = DBInit();