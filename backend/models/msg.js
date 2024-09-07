const mongoose = require('mongoose')
const User = require('./user')
const Group = require('./group')
const DirectMsg = require('./directMsg')
const Schema = mongoose.Schema

const msgSchema = new Schema({
    content : {type: String, required: true},
    timestamp : {type: Date, default: Date.now},
    sender : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    group : {type: mongoose.Schema.Types.ObjectId, ref: "Group"},
    directMsg : {type: mongoose.Schema.Types.ObjectId, ref: "DirectMsg"},
    starred : {type: Boolean, default: false},
    type : {type: String, enum: ['msg', 'image'], required: true},
    isDirectMsg : {type: Boolean, required: true},
    translatedContent :{ type:String,default:null},
});

module.exports = mongoose.model('Msg', msgSchema)