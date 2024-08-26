const mongoose = require('mongoose')
const User = require('./user')
const Group = require('./group')
const DirectMsg = require('./directMsg')
const Schema = mongoose.Schema

const msgSchema = new Schema({
    contant : {type: String, required: true},
    timestamp : {type: Date, default: Date.now},
    Sender : {type: Schema.Types.ObjectId, ref: User, required: true},
    group : {type: Schema.Types.ObjectId, ref: Group},
    directMsg : {type: Schema.Types.ObjectId, ref: DirectMsg},
    star : {type: Boolean, default: false},
    type : {type: String, enum: ['msg', 'image'], required: true},
    isDirectMsg : {type: Boolean, required: true},
    translatedContent : String,
})