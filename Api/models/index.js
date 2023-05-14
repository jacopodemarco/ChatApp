const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.messages = require("./messages.model");
db.groups = require("./groups.model");

module.exports = db;