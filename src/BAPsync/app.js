var express = require('express');
var fs = require("fs");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieparser = require('cookie-parser');
var https = require("https");

var app = express();

//require user made
var config = require("./imports/config.js");
var mongoDB = require("./imports/mongoDB.js");
var git = require("./imports/git.js");

console.log('required everything');


//variables
var debug = config.debug;
var username;

//use
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

var init = function () {
    var bachelorList = git.GetBachelorRepos();
    //filter

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
        fs.writeFile("./debug/LoginPost.txt", JSON.stringify(req.body));
    }

    var ok = git.authenticateUser(req.body.username, req.body.password);

    if (ok) {
        username = req.body.username;
        res.redirect("./main"); //bestaat nog niet ook mischien een redirect afhankelijk of de user al een userlist heeft op de database of niet
    } else {
        console.log("login with username: " + req.body.username + " failed");
    }

});




https.createServer({
    key: fs.readFileSync(path.join(__dirname, '/openSSL/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/openSSL/cert.pem'))
}, app).listen(3541)

//init(); reading the token from the file seems to be a problem and never works o.O