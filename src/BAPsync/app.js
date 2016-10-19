var express = require('express');
var fs = require("fs");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieparser = require('cookie-parser');
var https = require("https");
var mongoose = require("mongoose");

var app = express();

//require user made
var config = require("./imports/config.js");
var mongoDB = require("./imports/mongoDB.js");
var git = require("./imports/git.js");

console.log('required everything');

//database
mongoose.connect(config.db.link);
console.log("made db connection");

//variables
var debug = true;

//use
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());


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

    res.redirect("./mainPage"); //bestaat nog niet ook mischien een redirect afhankelijk of de user al een userlist heeft op de database of niet
});




https.createServer({
    key: fs.readFileSync(path.join(__dirname, '/openSSL/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/openSSL/cert.pem'))
}, app).listen(3541)