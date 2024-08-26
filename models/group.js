const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema
//thids is duicwufbgwyfgwy
const groupSchema = new Schema({
    participant: [{type: Schema.Types.ObjectId, ref: User}],
    isPrivate: {type: Boolean, defalut: true},
    name: {type: String, required: true},
    description: String
})

module.exports = mongoose.model('Group', groupSchema)