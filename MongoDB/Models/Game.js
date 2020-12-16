const { Schema, model } = require('mongoose')

var GameSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},
{
    versionKey: false,
    collection: "Games"
})

const Game = model('Game', GameSchema)

module.exports = Game