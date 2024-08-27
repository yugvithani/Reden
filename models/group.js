const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema

const groupSchema = new Schema({
    participant: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    isPrivate: {type: Boolean, default: true},
    name: {type: String, required: true},
    description: {type: String, default:""},
});

module.exports = mongoose.model('Group', groupSchema)