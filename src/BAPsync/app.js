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
        token: token,
    });

    github.users.getFollowingForUser({
        user: "jonathan2266"
    }, function (err, res) {
        console.log(JSON.stringify(res));
    });

}







app.listen(process.env.NODEJS_PORT || 3541, function () {
    console.log('Server running ' + (process.env.NODEJS_PORT || 3541));
});

authenticateUser();