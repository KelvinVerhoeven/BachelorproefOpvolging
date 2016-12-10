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

var updateStudentList = setInterval(function () {

    git.GetBachelorRepos(function (bList) {
        JSONFilter.FilterBAPS(bList, function (filtered) {
            mongoDB.updateStudentList(filtered);
        });
    });

}, 600000);

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
                            res.json({ auth: true, redirect: "/overview" });
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

app.get("/overview",
    function (req, res) {
        if (debug) {
            console.log("got get /overview request");
        }
        res.sendFile(path.join(__dirname, "./html/overview.html"));
});

app.post("/overview/get",
    function(req, res) {
        if (debug) {
            console.log("got post /overview/get request");
        }
        mongoDB.GetStudentRepoSpecific(req.body.full, function(call) {
            res.json(call);
        });
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

app.post("/studentList/refresh", function (req, res) {
    if (debug) {
        console.log("got post /studentList/refresh request");
    }
    git.GetBachelorRepos(function (bList) {
        JSONFilter.FilterBAPS(bList, function (filtered) {
            mongoDB.updateStudentList(filtered);
            res.json();
        });
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

app.post("/repos/get",
    function(req, res) {
        if (debug) {
            console.log("got get /repos/get request");
        }
        git.GetUserRepo(req.body.username,
            req.body.password, req.body.owner, req.body.repo,
            function(call) {
                res.json( call );
            });
    });

app.get("/commit",
    function(req, res) {
        if (debug) {
            console.log("got get /commits request");
        }
        res.sendFile(path.join(__dirname, "./html/commit.html"));
    });

app.post("/commit/get",
    function(req, res) {
        if (debug) {
            console.log("got get /commits/get request");
        }
        git.GetCommits(req.body.username,
            req.body.password, req.body.student,
            req.body.repo,
            function(commits) {
                res.json(commits);
            });
    });

app.post("/user/get",
    function(req, res) {
        if (debug) {
            console.log("got get /user request");
        }
        git.GetUserMail(req.body.username,
            req.body.password,
            req.body.student,
            function(call) {
                res.json(call);
            });
    });

app.get("/issues", function (req, res) { //issues webpage
    if (debug) {
        console.log("got get issues request");
    }
    res.sendFile(path.join(__dirname, "./html/issues.html"));
});

app.get("/issues/form", function (req, res) {
    if (debug) {
        console.log("got get issues/form request");
    }
    res.sendFile(path.join(__dirname, "./html/issuesForm.html"));
});

app.post("/issues/get", function (req, res) { // needs testing only one at a time
    if (debug) {
        console.log("got post /issues/get request");
    }
    mongoDB.GetSubscriptionList(req.body.username, function (list) {
        mongoDB.GetStudentRepos(function (fullStudRepos) {
            for (var fullStudRepo in fullStudRepos) {
                for (var repo in list) {
                    if (list[repo].studentRepo == fullStudRepos[fullStudRepo].full && fullStudRepos[fullStudRepo].repo == req.body.repo) { // ye 
                        git.GetIssues(req.body.username, req.body.password, fullStudRepos[fullStudRepo], function (issues) {
                            if (debug) {
                                fs.writeFile("./debug/issues.txt", JSON.stringify(issues.issues, null, "\n"));
                            }
                            res.json(issues.issues);
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
    git.CloseIssue(req.body.username, req.body.password, req.body.student, req.body.repo, req.body.number, req.body.state, function (ok) {
        res.json({ "done": ok });
    });
});

app.post("/issues/create", function (req, res) {
    if (debug) {
        console.log("got post /issues/create request");
    }
    git.CreateIssue(req.body.username, req.body.password, req.body.student, req.body.repo, req.body.title, req.body.body, function (call) {
        res.json({ "done": call });
    });

});

app.post("/comments", function (req, res) {
    if (debug) {
        console.log("got post /comments request");
    }
    git.getComments(req.body.username, req.body.password, req.body.student, req.body.repo, req.body.number, function (call) {
        if (debug) {
            fs.writeFile("./debug/comments.txt", JSON.stringify(call, null, "\n"));
        }
        res.json(call);
    });
});

app.post("/comments/new", function (req, res) {
    if (debug) {
        console.log("got post /comments/new request");
    }
    git.createComment(req.body.username, req.body.password, req.body.student, req.body.repo, req.body.number, req.body.body, function (call) {
        res.json({ "done": call });
    });
});

app.post("/log/get", function (req, res) {
    if (debug) {
        console.log("got post /logs/get request");
    }
    git.getLog(req.body.username, req.body.password, req.body.owner, req.body.repo, function (markdown) {
        if (markdown == false) {
            res.json("<p>This student does not have a Log<\p>");
        } else {
            JSONFilter.MarkDown2HTML(markdown, function (html) {
                res.json(html);
            });
        }

    });
});

app.post("/scriptie/get", function (req, res) {
    if (debug) {
        console.log("got post /scriptie/get request");
    }
    git.getScriptie(req.body.username, req.body.password, req.body.owner, req.body.repo, function (pdf) {
        if (pdf == false) {
            res.json({ "ok": false });
        } else {
            res.json(pdf);
        }
    });
});

https.createServer({
    key: fs.readFileSync(path.join(__dirname, '/openSSL/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/openSSL/cert.pem'))
}, app).listen(3541);

init();