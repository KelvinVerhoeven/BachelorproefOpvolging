var express = require('express');
var fs = require("fs");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieparser = require('cookie-parser');
var GitHubApi = require("github");
var https = require("https");
var mongoose = require("mongoose");

var app = express();

//require user made
var config = require("./imports/config.js");
var mongoDB = require("./imports/mongoDB.js");

console.log('required everything');

//database
mongoose.connect(config.db.link);
console.log("made db connection");

//variables
var debug = true;

//use
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());


var github = new GitHubApi({
    debug: true,
    protocol: "https",
    host: "api.github.com",
    headers: {
        "user-agent": "automat-BAP"
    },
    Promise: require('bluebird'),
    followRedirects: false,
    timeout: 5000
});

var authenticateUser = function (username, password) {

    github.authenticate({
        type: "basic",
        username: username,
        password: password
    });

    github.users.getFollowingForUser({
        user: "jonathan2266"
    }, function (err, res) {
        if (debug) {
            console.log(JSON.stringify(res));
            fs.writeFile("./debug/contentRepo.txt", res);
        }
        });
    github.repos.getAll({

    }, function (err, res) {
        if (debug) {
            console.log(JSON.stringify(res));
            fs.writeFile("./debug/getAll.txt", JSON.stringify(res), null, 4);
        }
        });

    if (debug) {
        console.log("user: " + username + " authenticated");
    }
}

app.get("/login", function (req, res) {
    if (debug) {
        console.log("got get /login request");
    }
    res.sendFile(path.join(__dirname, "./html/login.html"));
});

app.post("/login", function (req, res) {
    if (debug) {
        console.log("got post /login request");
    }

    authenticateUser(req.body.username, req.body.password);

    res.redirect("./mainPage"); //bestaat nog niet ook mischien een redirect afhankelijk of de user al een userlist heeft op de database of niet
});




https.createServer({
    key: fs.readFileSync(path.join(__dirname, '/openSSL/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/openSSL/cert.pem'))
}, app).listen(3541)