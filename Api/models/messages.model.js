const mongoose = require("mongoose");

const Messages = mongoose.model("messages",
new mongoose.Schema({
name: String,
payload: String
}));

module.exports = Messages;