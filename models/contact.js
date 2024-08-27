const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema

const contactSchema = new Schema({
    sender : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    receiver : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema)