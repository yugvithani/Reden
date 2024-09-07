const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username : {type : String, required: true, unique: true},
    password : {type: String, reqiured: true},
    email : {type: String, required: true, unique: true},
    phoneNo : {type: String, required: true},
    profilePicture : {type:String,required:null},
    language : {type:[String],required:true},
    bio :{type:String,default:""},

    isOnline :{type:Boolean,default:false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema)