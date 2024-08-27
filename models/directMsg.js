const mongoose = require('mongoose')
const User = require('./user')
const Msg = require('./msg')
const Schema = mongoose.Schema

const directMsgSchema = new Schema({
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    msg: {type: Schema.Types.ObjectId, ref: "Msg"}
});

module.exports = mongoose.model('DirectMsg', directMsgSchema)