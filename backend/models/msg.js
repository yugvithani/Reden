const mongoose = require('mongoose')
const User = require('./user')
const Group = require('./group')
const Schema = mongoose.Schema

const msgSchema = new Schema({
    content : {type: String, required: true},
    timestamp : {type: Date, default: Date.now },
    sender : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    group : {type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null},
    receiver : {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    starred : {type: Boolean, default: false},
    type : {type: String, enum: ['msg', 'image'], required: true},
    isDirectMsg : {type: Boolean, required: true},
    isRead : {type: Boolean, default: false},
    translatedContent :{ type: String, default: null},
});

module.exports = mongoose.model('Msg', msgSchema)