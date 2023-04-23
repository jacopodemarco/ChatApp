const mongoose = require("mongoose");

const User = mongoose.model("Users",
new mongoose.Schema({
username: String,
email: String,
Password: String,
roles:[
 {
   type: mongoose.Schema.Types.ObjectId,
   ref: "Role" 
 }
]
}));

module.exports = User;