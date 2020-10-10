const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	fname: String,
	lname: String,
	email: String,
	phone: Number,
	password: String,
});

module.exports = mongoose.model('dbusers',userSchema );