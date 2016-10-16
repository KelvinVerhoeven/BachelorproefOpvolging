var express = require('express');
var fs = require("fs");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieparser = require('cookie-parser');
var GitHubApi = require("github");

var app = express();

console.log('required everything');

//variables
var token = "";
var debug = true;

//use
app.use(express.static(path.join(__dirname, "html")));
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

var authenticateUser = function () {

    token = fs.readFileSync("key.txt").toString();

    github.authenticate({
        type: "token",
        token: "d8a9b9598608b5398bed06b58380637a1555c2c8"
    });

    github.users.getFollowingForUser({
        user: "jonathan2266"
    }, function (err, res) {
        if (debug) {
            console.log(JSON.stringify(res));
            fs.writeFile("./debug/contentRepo.txt", JSON.stringify(res));
        }
    });

}







app.listen(process.env.NODEJS_PORT || 3541, function () {
    console.log('Server running ' + (process.env.NODEJS_PORT || 3541));
});

authenticateUser();