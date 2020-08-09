const {COLL_Members, COLL_Games} = require("./config.json")
const connection = require('./connection')

async function GetCommonGames(users){
    const db = await connection.GetMongoDB();
    return db
        .collection(COLL_Members)
        .aggregate(BuildCommonGamesAggPipeline(users))
        .toArray()
}

async function SearchGamesFromText(searchText){
    const db = await connection.GetMongoDB();
    return db
      .collection(COLL_Games)
      .aggregate(BuildGameOwnersAggPipeline(searchText))
      .limit(3)
      .toArray()
}

function Close(){
    connection.CloseMongoDB();
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
// Returns an array of games and members that own that game
// Relies on a regex pattern to do a text search for games 
// matching user input then looks up members that own the
// game before returning their discord alias.
function BuildGameOwnersAggPipeline(pattern){
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

module.exports = {
    GetCommonGames,
    SearchGamesFromText,
    Close
}