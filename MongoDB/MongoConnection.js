const {COLL_Members, COLL_Games} = require("./config.json")
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const url = process.env.DB_CONN_STRING
const dbName = process.env.DB_NAME

class MongoConnection{
    constructor(){
        this.Client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
        this.Client.connect()
    }

    CloseConnection(){
        this.Client.close();
    }

    async GetMember(userID){
        const db = await this.Client.db(dbName)
        return db
            .collection(COLL_Members)
            .findOne(
                { _id: userID },
                { projection: { games: 0 } }
            )
    }

    async GetCommonGames(users){
        const db = await this.Client.db(dbName)
        return db
            .collection(COLL_Members)
            .aggregate(this.BuildCommonGamesAggPipeline(users))
            .toArray()
    }

    async SearchGamesFromText(searchText){
        const db = await this.Client.db(dbName);
        return db
          .collection(COLL_Games)
          .aggregate(this.BuildGameOwnersAggPipeline(searchText))
          .limit(3)
          .toArray()
    }

    BuildCommonGamesAggPipeline(users){
        return [
            { $match: { _id: { $in: users }} },
            { $unwind: '$games' },
            { $group: {_id: '$games',count: {$sum: 1}} },
            { $match: {count: users.length} },
            {
              $lookup: {
                from: 'Games',
                localField: '_id',
                foreignField: '_id',
                as: 'game'
              }
            },
            {
              $project: {
                "_id": 0,
                'name': { $arrayElemAt: [ "$game.name", 0 ] }
              }
            },
            { $sort: { name: 1 } }
        ]
    }

    BuildGameOwnersAggPipeline(pattern){
        return [
            { $match: { name: { $regex: pattern }} },
            {
              $lookup: {
                from: 'Members',
                localField: '_id',
                foreignField: 'games',
                as: 'members'
              }
            },
            {
              $project:{
                _id: 0,
                name: 1,
                "members": {
                  $map:{
                    input: "$members",
                    as: "member",
                    in: { alias: "$$member.discordAlias" }
                  }
                }
              }
            }
        ]
    }
}

module.exports = MongoConnection