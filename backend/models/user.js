const mongoose = require('mongoose')
const {Group} = require('./group');

const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {type : String, required: true, unique: true},
    password : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    phoneNo : {type: String, required: true},
    profilePicture : {type:String,default:null},
    language : {type:String,required:true},
    bio :{type:String,default:""},
    contact : [{
        receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
        lastSeen: { type: Date, default: Date.now } //when last they send msg
    }],
    group : [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}],

    isOnline :{type:Boolean,default:false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);