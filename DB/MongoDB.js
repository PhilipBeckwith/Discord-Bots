const {COLL_Members} = require("./config.json")
const connection = require('./connection')

async function GetCommonGames(users){
    const db = await connection.GetMongoDB();
    return db
        .collection(COLL_Members)
        .aggregate(BuildCommonGamesAggPipeline(users))
        .toArray()
}

function BuildCommonGamesAggPipeline(users){
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

module.exports = {
    GetCommonGames
}