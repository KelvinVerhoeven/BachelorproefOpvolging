//contains functions for mongoDB
var mongoose = require("mongoose");
var config = require("./config.js");

var debug = config.debug;

mongoose.connect(config.db.link);
console.log("made db connection");

module.exports = {
    foo: function () {
        console.log("worked");
    },
    GetSubscriptionList: function (username) {
        //db insert
    },
    AddToSubscriptionList: function (username, student) {

    },
    RemoveFromSubscriptionList: function (username, student) {

    }
};