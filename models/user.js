const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {type : String, required: true},
    password : {type: String, reqiured: true},
    email : {type: String, required: true, unique: true},
    phoneNo : {type: String, required: true},
    profilePicture : String,
    language : [String],
    bio : String, 

    isOnline : Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)