var mongoose = require("mongoose");
var express = require("express");

const API_PORT = 3001;
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/dbtravel", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
var db = mongoose.connection;

db.on("error", console.log.bind(console, "connection error"));
db.once("open", () => {
	console.log("connection succeeded");
});

let UserModel = require('./schema/user');

var bodyParser = require("body-parser");
const { response } = require("express");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/adduser", (req, res) => {
	var myData = new UserModel(req.body);
	myData
		.save()
		.then((item) => {
			res.send(item);
			console.log("item saved in database");
		})
		.catch((err) => {
			res.status(400).send("unable to save database");
			console.log("some error occured");
		});
});

app.get("/view", (req, res) => {
	UserModel.find({}, function (err, docs) {
		if (err) {
			res.send("Some error occured", err);
		} else {
			res.send({ user: docs });
		}
	});
});

app.post("/updateData", function (req, res) {
	UserModel.findByIdAndUpdate(
		req.body.id,
		{
			fname: req.body.fname,
			lname: req.body.lname,
			email: req.body.email,
			phone: req.body.phone,
			password: req.body.password,
		},
		function (err) {
			if (err) {
				res.send(err);
				return;
			}
			res.send({ data: "Record has been updated" });
		}
	);
});

app.post("/removeData", function (req, res) {
	UserModel.remove({ _id: req.body.id }, function (err) {
		if (err) {
			res.send(err);
		} else {
			res.send({ data: "Record has been deleted" });
		}
	});
});

// app.use("/", (req, res) => {
// 	res.json({ firstName: "Hello world"});
// });
app.use("/public", express.static(__dirname + "/public"));

app.listen(API_PORT, function () {
	console.log("server is running on ", API_PORT);
});
