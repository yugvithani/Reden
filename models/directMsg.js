const mongoose = require('mongoose')
const User = require('./user')
const Schema = mongoose.Schema

const directMsgSchema = new Schema({
    receiver: {type: Schema.Types.ObjectId, ref: User},
    msg: {type: Schema.Types.ObjectId, ref: DirectMsg}
})