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

//create schema for docents
var docentSchema = new mongoose.Schema({
    docent: String
});
//create model from it
var DocentDB = mongoose.model("docent", docentSchema);


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

        for (var student in studentRepos) {
            StudentDB.findOne({ "repo": studentRepos[student].name }, "owner repo", function (err, res) {
                if (err) {
                    console.log("error in retrieving studentsList from database: " + err);
                } else if (res == null){
                    StudentDB.create({
                        owner: studentRepos[student].owner.login,
                        repo: studentRepos[student].name
                    }, function (err, stud) {
                        if (err) {
                            console.log("err in saving student to database: " + err);
                        }
                    });
                }
            });
        }
    },
    updateDocentList: function (docent, callback) {

        var hadEntry = true;

        DocentDB.findOne({ "docent": docent }, "docent", function (err, res) {
            if (err) {
                console.log("err in retrieving docentList from database");
            } else if (res == null) {
                hadEntry = false;
                DocentDB.create({
                    docent: docent
                }, function (err, res) {
                    if (err) {
                        console.log("err in saving docent to database: " + err);
                    }
                });
            }
        });
        callback(hadEntry);
    }
};