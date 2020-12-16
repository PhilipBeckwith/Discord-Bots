const mongoose = require('mongoose')
const { Schema } = mongoose

var MemberSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    steamID: {
        type: Number,
    },
    discordAlias: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    }
},
{
    versionKey: false,
    collection: "Members"
})

const Member = mongoose.model('Member', MemberSchema)

module.exports = Member