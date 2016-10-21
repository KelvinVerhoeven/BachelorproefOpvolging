//contains functions for mongoDB
var mongoose = require("mongoose");
var config = require("./config.js");

var debug = config.debug;

mongoose.connect(config.db.link);
console.log("made db connection");

//create schema for students
var studentSchema = new mongoose.Schema({
    owner: String,
    repo: String
});
//create model from it
var StudentDB = mongoose.model("student", studentSchema);

console.log("made database schemas and models");

module.exports = {
    GetSubscriptionList: function (username) {
        //db insert
    },
    AddToSubscriptionList: function (username, student) {

    },
    RemoveFromSubscriptionList: function (username, student) {

    },
    updateStudentList: function (studentRepos) {

        var currentlyInDB = StudentDB.find(function (err, res) {
            if (err != null) {
                console.log("error in retrieving studentsList from database: " + err);
            } else {
                return res;
            }
        });

        //for (var student in studentRepos) {

        //    StudentDB.create({
        //        owner: studentRepos[student].owner.login,
        //        repo: studentRepos[student].name
        //    }, function (err, stud) {
        //        if (err) {
        //            console.log("err in saving student to database: " + err);
        //        }
        //    });
        //}
    }
};