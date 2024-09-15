const mongoose = require('mongoose')
const User = require('./user');
const Schema = mongoose.Schema

const groupSchema = new Schema({
    groupCode: {type: String, unique: true},
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    participant: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    name: {type: String, required: true},
    description: {type: String, default:""},
});

module.exports = mongoose.model('Group', groupSchema)