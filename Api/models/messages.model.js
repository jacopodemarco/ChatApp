const mongoose = require("mongoose");
var ObjectId = require('mongoose').Types.ObjectId; 


const Messages = mongoose.model("messages",
new mongoose.Schema({
    payload : String,
    username: String ,
    room: ObjectId,  
},{ timestamps: true }));

module.exports = Messages;