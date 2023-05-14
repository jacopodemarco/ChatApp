const mongoose = require("mongoose");

const Groups = mongoose.model("groups",
new mongoose.Schema({
    name: String ,
    members: Array  
},{ timestamps: true }));

module.exports = Groups;