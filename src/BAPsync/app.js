var express = require('express');
var fs = require("fs");
var path = require('path');
var bodyParser = require('body-parser');
var https = require("https");

var app = express();

//require user made
var config = require("./imports/config.js");
var mongoDB = require("./imports/mongoDB.js");
var git = require("./imports/git.js");
var JSONFilter = require("./imports/JSONFilter.js");

console.log('required everything');


//variables
var debug = config.debug;
var username;

//use
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

var init = function () {
    
    git.GetBachelorRepos(function (bList) {
        JSONFilter.FilterBAPS(bList, function (filtered) {
            mongoDB.updateStudentList(filtered);
        });
    });

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

    git.authenticateUser(req.body.username, req.body.password);
    git.checkIfLoggedIn(function (auth) {
        if (auth) {
            console.log("login with username: " + req.body.username + " successful");
            username = req.body.username;
            mongoDB.updateDocentList(req.body.username, function (hadEntry) {
                if (hadEntry) {
                    res.redirect("./main");
                } else {
                    res.redirect("./updateStudentList");
                }
            });
        } else {
            console.log("login with username: " + req.body.username + " failed");
        }
    });
});




https.createServer({
    key: fs.readFileSync(path.join(__dirname, '/openSSL/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/openSSL/cert.pem'))
}, app).listen(3541)

init();