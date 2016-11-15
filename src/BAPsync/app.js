var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var https = require('https');

var app = express();

//require user made
var config = require("./imports/config.js");
var mongoDB = require("./imports/mongoDB.js");
var git = require("./imports/git.js");
var JSONFilter = require("./imports/JSONFilter.js");

console.log('aquired everything');


//variables
var debug = config.debug;

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
app.get("/", function (req, res) {
    if (debug) {
        console.log("got get on root");
    }
    res.redirect("/login");
});

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
    var username = req.body.username;
    var pass = req.body.password;

    if (username != undefined && pass != undefined) {
        git.authenticateUser(req.body.username, req.body.password);
        git.checkIfLoggedIn(function (auth) {
            if (auth) {
                console.log("login with username: " + req.body.username + " successful");
                mongoDB.updateDocentList(req.body.username, function (hadEntry) {
                    mongoDB.CheckSubscriptionList(req.body.username, hadEntry, function (newHadEntry) {
                        if (newHadEntry) {
                            res.json({ auth: true , redirect: "/main" });
                        } else {
                            res.json({ auth: true , redirect: "/studentList" });
                        }
                    });
                });
            } else {
                console.log("login with username: " + req.body.username + " failed");
            }
        });
    }
});

app.get("/studentList", function (req, res) {
    if (debug) {
        console.log("got get /studentList request");
    }
     res.sendFile(path.join(__dirname, "./html/StudentList.html"));
});

app.post("/studentsList/get", function (req, res) {
    if (debug) {
        console.log("got post /studentsList/get request");
    }
    mongoDB.GetStudentRepos(function (students) {
        if (debug) {
            fs.writeFile("./debug/getStudentsListFromDB.txt", JSON.stringify(students, null, "\n"));
        }
        res.json(students);
    });
});

app.post("/studentList/add", function (req, res) {
    if (debug) {
        console.log("got post /studentList/add request");
    }
    mongoDB.AddToSubscriptionList(req.body.username, req.body.studentRepo, function (ok) {
        res.json({ "done": ok });
    }); //studentRepo needs to be like jonathan2266/myRepo
});

app.post("/studentList/remove", function (req, res) {
    if (debug) {
        console.log("got post /studentList/remove request");
    }
    mongoDB.RemoveFromSubscriptionList(req.body.username, req.body.studentRepo, function (ok) {
        res.json({ "done": ok });
    });
});

app.post("/subscriptionList", function (req, res) {
    if (debug) {
        console.log("got post /subscriptionList request");
    }
    mongoDB.GetSubscriptionList(req.body.username, function (list) {
        res.json(list);
    });
});

app.get("/issues", function (req, res) {
    if (debug) {
        console.log("got get issues request");
    }
});

app.post("/issues/get", function (req, res) { // needs testing only one at a time
    if (debug) {
        console.log("got post /issues/get request");
    }
    mongoDB.GetSubscriptionList(req.body.username, function (list) {
        mongoDB.GetStudentRepos(function (fullStudRepos) {
            for (var fullStudRepo in fullStudRepos) {
                for (var repo in list) {
                    if (list[repo].studentRepo == fullStudRepos[fullStudRepo].full) {
                        git.GetIssues(fullStudRepos[fullStudRepo], function (issues) {
                            res.json(issues);
                        });
                    }
                }
            }
        });
    });
});

app.post("/issues/close", function (req, res) {
    if (debug) {
        console.log("got post /issues/close request")
    }
    git.CloseIssue(req.body.yolo, function (ok) {
        res.json({ "done": ok });
    });
});

app.post("/issues/create", function (req, res) {
    if (debug) {
        console.log("got post /issues/create request");
    }
    git.CreateIssue(req.body.issue, function (call) {
        res.json({ "done": call });
    });

});

https.createServer({
    key: fs.readFileSync(path.join(__dirname, '/openSSL/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/openSSL/cert.pem'))
}, app).listen(3541);

init();