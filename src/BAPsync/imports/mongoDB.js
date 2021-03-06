﻿//contains functions for mongoDB
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

module.exports = { //needs testing
    GetSubscriptionList: function (username, callback) {
        DocStudLinkDB.find({ "docent": username }, "docent studentRepo", function (err, res) {
            if (err) {
                console.log("err in retrieving subscription list from database: " + err);
            } else {
                callback(res);
            }
        });
    },

   

    AddToSubscriptionList: function (username, studentRepo, callback) {
        DocStudLinkDB.findOne({ "docent": username, "studentRepo": studentRepo }, "docent studentRepo", function (err, res) {
            if (err) {
                console.log("err in retrieving subscription list from databese: " + err);
            } else if (res == null) {
                DocStudLinkDB.create({
                    docent: username,
                    studentRepo: studentRepo
                }, function (err, res) {
                    if (err != null) {
                        console.log("Database AddToSubscriptionList failed: " + err);
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            }
        });
    },
    RemoveFromSubscriptionList: function (username, studentRepo, callback) { //needs testing
        DocStudLinkDB.remove({ "docent": username, "studentRepo": studentRepo }, function (err, res) {
            if (err) {
                console.log("err in removing students from subscription list");
                callback(false);
            } else {
                callback(true);
            }
        });
    },
    CheckSubscriptionList: function (docent, hadEntry, callback) { //needs tesing

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
            CheckStudentListAgainstDB(studentRepos[student]);
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
    },
    GetStudentRepos: function (callback) { //callback is a json
        StudentDB.find({}, function (err, res) {
            if (err) {
                console.log("Database error in GetStudentRepos: " + err);
            } else {
                callback(res);
            }
        });
    },
    GetStudentRepoSpecific: function (full, callback) { 
        StudentDB.findOne({ "full": full }, "repo owner", function (err, res) {
            if (err) {
                console.log("Database error in GetStudentRepos: " + err);
            } else {

                callback(res);
            }
        });
    }
    
};

//privates
var CheckStudentListAgainstDB = function (student) {
    StudentDB.findOne({ "full": student.owner.login + "/" + student.name }, "full owner repo", function (err, res) {
        if (err) {
            console.log("error in retrieving studentsList from database: " + err);
        } else if (res == null) {
            StudentDB.create({
                full: student.owner.login + "/" + student.name,
                owner: student.owner.login,
                repo: student.name
            }, function (err, res) {
                if (err) {
                    console.log("err in saving student to database: " + err);
                } else {
                    console.log("inserted new student in DB: " + student.owner.login + "/" + student.name)
                }
            });
        }
    });
}