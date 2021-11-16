const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.uri = dbConfig.uri;
db.userProfiles = require("./userProfile.model.js")(mongoose);
db.restaurant = require("./restaurant.model.js")(mongoose);
module.exports = db;