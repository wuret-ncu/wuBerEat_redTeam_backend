const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.uri = process.env.MONGO_DB_CONNECTION_STRING;
db.userProfiles = require("./userProfile.model.js")(mongoose);
db.restaurant = require("./restaurant.model.js")(mongoose);
db.cart = require("./cart.model.js")(mongoose)


module.exports = db;