var express = require('express');
var compression = require('compression');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var https = require('https');
var session = require('express-session')

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
app.use(session({
    secret: 'xfh$^dvmgljwmvfh3g64dsv3bg12hlbcldùv^ùjkv=:jfe56',
    resave: false,
    cookie: { path: '/', httpOnly: false, secure: true, maxAge: null }
}));
app.use(compression());

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

var validateSession = function (session, callback) {

    if (session.username == undefined || session.password == undefined) {
        callback(false);
    }
    else {
        callback(true);
    }
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
                req.session.username = req.body.username;
                req.session.password = req.body.password;
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
                res.json({ auth: false });
            }
        });
    }
});

app.get("/studentList", function (req, res) {
    if (debug) {
        console.log("got get /studentList request");
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.redirect("/login");
        } else {
            res.sendFile(path.join(__dirname, "./html/StudentList.html"));
        }
    });
});

app.get("/overview",
    function (req, res) {
        if (debug) {
            console.log("got get /overview request");
            console.log("user: " + req.session.username);
        }
        validateSession(req.session, function (isvalid) {
            if (!isvalid) {
                res.redirect("/login");
            } else {
                res.sendFile(path.join(__dirname, "./html/overview.html"));
            }
        });
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
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.json({ "done": false });
        } else {
            mongoDB.AddToSubscriptionList(req.session.username, req.body.studentRepo, function (ok) {
                res.json({ "done": ok });
            }); //studentRepo needs to be like jonathan2266/myRepo
        }
    });

});

app.post("/studentList/remove", function (req, res) {
    if (debug) {
        console.log("got post /studentList/remove request");
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.json({ "done": false });
        } else {
            mongoDB.RemoveFromSubscriptionList(req.session.username, req.body.studentRepo, function (ok) {
                res.json({ "done": ok });
            });
        }
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
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.end();
        } else {
            mongoDB.GetSubscriptionList(req.session.username, function (list) {
                res.json(list);
            });
        }
    });
});

app.post("/repos/get",
    function(req, res) {
        if (debug) {
            console.log("got get /repos/get request");
        }
        validateSession(req.session, function (isValid) {
            if (!isValid) {
                res.end();
            } else {
                git.GetUserRepo(req.session.username,
                    req.session.password, req.body.owner, req.body.repo,
                    function (call) {
                        res.json(call);
                    });
            }
        });
    });

app.get("/commit",
    function(req, res) {
        if (debug) {
            console.log("got get /commits request");
        }
        validateSession(req.session, function (isValid) {
            if (!isValid) {
                res.redirect("/login");
            } else {
                res.sendFile(path.join(__dirname, "./html/commit.html"));
            }
        });
    });

app.post("/commit/get",
    function(req, res) {
        if (debug) {
            console.log("got get /commits/get request");
        }
        validateSession(req.session, function (isValid) {
            if (!isValid) {
                res.end();
            } else {
                git.GetCommits(req.session.username,
                    req.session.password, req.body.student,
                    req.body.repo,
                    function (commits) {
                        res.json(commits);
                    });
            }
        });
    });

app.get("/issues", function (req, res) { //issues webpage
    if (debug) {
        console.log("got get issues request");
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.redirect("/login");
        } else {
            res.sendFile(path.join(__dirname, "./html/issues.html"));
        }
    });
});

app.get("/issues/form", function (req, res) {
    if (debug) {
        console.log("got get issues/form request");
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.redirect("/login");
        } else {
            res.sendFile(path.join(__dirname, "./html/issuesForm.html"));
        }
    });
});

app.post("/issues/get", function (req, res) { // needs testing only one at a time
    if (debug) {
        console.log("got post /issues/get request");
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.end();
        } else {
            mongoDB.GetSubscriptionList(req.session.username, function (list) {
                mongoDB.GetStudentRepos(function (fullStudRepos) {
                    for (var fullStudRepo in fullStudRepos) {
                        for (var repo in list) {
                            if (list[repo].studentRepo == fullStudRepos[fullStudRepo].full && fullStudRepos[fullStudRepo].repo == req.body.repo) { // ye 
                                git.GetIssues(req.session.username, req.session.password, fullStudRepos[fullStudRepo], function (issues) {
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
        }
    });
});

app.post("/issues/close", function (req, res) {
    if (debug) {
        console.log("got post /issues/close request")
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.json({ "done": false });
        } else {
            git.CloseIssue(req.session.username, req.session.password, req.body.student, req.body.repo, req.body.number, req.body.state, function (ok) {
                res.json({ "done": ok });
            });
        }
    });
});

app.post("/issues/create", function (req, res) {
    if (debug) {
        console.log("got post /issues/create request");
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.json({ "done": false });
        } else {
            git.CreateIssue(req.session.username, req.session.password, req.body.student, req.body.repo, req.body.title, req.body.body, function (call) {
                res.json({ "done": call });
            });
        }
    });
});

app.post("/comments", function (req, res) {
    if (debug) {
        console.log("got post /comments request");
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.end();
        } else {
            git.getComments(req.session.username, req.session.password, req.body.student, req.body.repo, req.body.number, function (call) {
                if (debug) {
                    fs.writeFile("./debug/comments.txt", JSON.stringify(call, null, "\n"));
                }
                res.json(call);
            });
        }
    });
});

app.post("/comments/new", function (req, res) {
    if (debug) {
        console.log("got post /comments/new request");
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.json({ "done": false });
        } else {
            git.createComment(req.session.username, req.session.password, req.body.student, req.body.repo, req.body.number, req.body.body, function (call) {
                res.json({ "done": call });
            });
        }
    });
});

app.post("/log/get", function (req, res) {
    if (debug) {
        console.log("got post /logs/get request");
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.end();
        } else {
            git.getLog(req.session.username, req.session.password, req.body.owner, req.body.repo, function (markdown) {
                if (markdown == false) {
                    res.json("<p>This student does not have a Log<\p>");
                } else {
                    JSONFilter.MarkDown2HTML(markdown, function (html) {
                        res.json(html);
                    });
                }
            });
        }
    });
});

app.post("/scriptie/get", function (req, res) {
    if (debug) {
        console.log("got post /scriptie/get request");
    }
    validateSession(req.session, function (isValid) {
        if (!isValid) {
            res.end();
        } else {
            git.getScriptie(req.session.username, req.session.password, req.body.owner, req.body.repo, function (pdf) {
                if (pdf == false) {
                    res.json({ "ok": false });
                } else {
                    res.json(pdf);
                }
            });
        }
    });
});

app.post("/info/get",
    function(req, res) {
        if (debug) {
            console.log("got post /info/get request");
        }
        validateSession(req.session, function (isValid) {
            if (!isValid) {
                res.end();
            } else {
                git.GetInfo(req.session.username,
                    req.session.password,
                    req.body.owner,
                    req.body.repo,
                    function (call) {
                        res.json(call);
                    });
            }
        });
    });

https.createServer({
    key: fs.readFileSync(path.join(__dirname, '/openSSL/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '/openSSL/cert.pem'))
}, app).listen(3541);

init();