//contains functions for mongoDB
var mongoose = require("mongoose");
var config = require("./config.js");

var debug = config.debug;

mongoose.connect(config.db.link);
console.log("made db connection");

//create schema for students
var studentSchema = new mongoose.Schema({
    full: String,
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

var DocStudLinkSchema = new mongoose.Schema({
    docent: String,
    studentRepo: String
});

var DocStudLinkDB = mongoose.model("DocStudLink", DocStudLinkSchema);

console.log("made database schemas and models");

module.exports = {
    GetSubscriptionList: function (username) {
        //db insert
    },
    AddToSubscriptionList: function (username, studentRepo) {

    },
    RemoveFromSubscriptionList: function (username, studentRepo) {

    },
    CheckSubscriptionList: function (docent, hadEntry, callback) {

        DocStudLinkDB.findOne({ "docent": docent }, "docent studentRepo", function (err, res) {
            if (err) {
                console.log("err in retrieving DocStudLink from database");
            } else if (res == null) {
                hadEntry = false;
                callback(hadEntry);
            } else if (res != null) {
                callback(hadEntry);
            }
        }); 
    },
    updateStudentList: function (studentRepos) {

        for (var student in studentRepos) {
            StudentDB.findOne({ "full": studentRepos[student].owner.login + "/" + studentRepos[student].name }, "full owner repo", function (err, res) {
                if (err) {
                    console.log("error in retrieving studentsList from database: " + err);
                } else if (res == null){
                    StudentDB.create({
                        full: studentRepos[student].owner.login + "/" + studentRepos[student].name,
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
                callback(hadEntry);
                DocentDB.create({
                    docent: docent
                }, function (err, res) {
                    if (err) {
                        console.log("err in saving docent to database: " + err);
                    }
                });
            } else if (res != null) {
                callback(hadEntry);
            }
        });

        
    }
};