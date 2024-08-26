const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema

const groupSchema = new Schema({
    participant: [{type: Schema.Types.ObjectId, ref: User}],
    isPrivate: {type: Boolean, defalut: true},
    name: {type: String, required: true},
    description: String
})