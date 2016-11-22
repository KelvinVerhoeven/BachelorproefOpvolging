//github methods
var GitHubApi = require("github");
var fs = require("fs");
var config = require("./config.js");
var tok = require("./key.js")
var path = require('path');

var debug = config.debug;
var organisatie = config.BAP.organisatie;

var github = new GitHubApi({
    debug: debug,
    protocol: "https",
    host: "api.github.com",
    headers: {
        "user-agent": "automat-BAP"
    },
    Promise: require('bluebird'),
    followRedirects: false,
    timeout: 5000
});

module.exports = {
    authenticateUser: function (username, password) {

        github.authenticate({ //runs in sync
            type: "basic",
            username: username,
            password: password
        });
    },
    checkIfLoggedIn: function(callback) {
        github.authorization.getAll({

        }, function (err, res) {
            var loggedIn;
            if (err != null) {
                callback(false);
            } else {
                callback(true);
            }
        });
    },
    searchRepos: function (term) {
        github.search.repos({
            q: term
        }, function (err, res) {
            fs.writeFile("././debug/searchRepo.txt", JSON.stringify(res, null, "\n"));
            console.log("done")
            });
    },
    GetBachelorRepos: function (callback) { //test repo we got can't be seen by filtering the AP repo

        var g = new GitHubApi({
            debug: debug,
            protocol: "https",
            host: "api.github.com",
            headers: {
                "user-agent": "automat-BAP"
            },
            Promise: require('bluebird'),
            followRedirects: false,
            timeout: 5000
        });

        g.authenticate({
            type: "token",
            token: tok
        }, function (err, res) {
            if (err != null) {
                console.log("bot login with token error: " + err);
            }
            });

        g.repos.getForUser({
            user: "jonathan2266"
        }, function (err, res) {
            if (err) {
                console.log("err in GetBachelorRepos: " + err);
            } else {
                callback(res);
            }
            });
        //g.users.getTeams({ //finding my team id
        //}, function (err, res) {
        //    fs.writeFile("././debug/getTeams.txt", JSON.stringify(res, null, "\n"));
        //    })

        //g.orgs.getTeamRepos({ // getting my team repo
        //    id: "2138835" //private team id containing the test repo
        //}, function (err, res) {
        //    fs.writeFile("././debug/getTeamRepos.txt", JSON.stringify(res, null, "\n"));

        //    //g.repos.get({
        //    //    owner: res.owner.login,
        //    //    repos: res.name
        //    //}, function (err, res) {
        //    //    fs.writeFile("././debug/getRepoforuser.txt", JSON.stringify(res, null, "\n"));
        //    //});

        //    callback(res);
        //});

        //g.repos.getForOrg({ //normally you scan here. But the test repo has to be found elsewhere
        //    org: organisatie
        //}, function (err, res) {
        //    if (debug) {
        //        fs.writeFile("././debug/orgList.txt", JSON.stringify(res, null, "\n"));
        //    }
        //    callback(res);
        //}); 
    },
    GetUserRepo: function(username, password, owner, repo, callback) {
        var result;

        var g = new GitHubApi({
            debug: debug,
            protocol: "https",
            host: "api.github.com",
            headers: {
                "user-agent": "automat-BAP"
            },
            Promise: require('bluebird'),
            followRedirects: false,
            timeout: 5000
        });

        g.authenticate({
            type: "basic",
            username: username,
            password: password
        });

        g.repos.get({
            owner: owner,
            repo: repo
        }, function(err, res) {
            if (err != null) {
                console.log("err in getUserData: " + err);
                callback("");
            } else {
                result = res;
                callback(result);
            }
        });
    },
    GetCommits: function (username, password, owner, repo, callback) {

        //get / repos /:owner /:repo / commits
        
        var result;

        var g = new GitHubApi({
            debug: debug,
            protocol: "https",
            host: "api.github.com",
            headers: {
                "user-agent": "automat-BAP"
            },
            Promise: require('bluebird'),
            followRedirects: false,
            timeout: 5000
        });

        g.authenticate({
            type: "basic",
            username: username,
            password: password
        });

        g.commits.getForRepo({
                owner: owner,
                repo: repo
            },
            function(err, res) {
                if (err != null) {
                    console.log("err in getCommit: " + err);
                    callback("");
                } else {
                    result.commits = res;
                    callback(result);
                }

            });
    },
    GetIssues: function (username, password, repo, callback) {

        var result = [];

        var g = new GitHubApi({
            debug: debug,
            protocol: "https",
            host: "api.github.com",
            headers: {
                "user-agent": "automat-BAP"
            },
            Promise: require('bluebird'),
            followRedirects: false,
            timeout: 5000
        });

       

        g.authenticate({
            type: "basic",
            username: username,
            password: password
        });

        g.issues.getForRepo({
            owner: repo.owner,
            repo: repo.repo
        }, function (err, res) {
            if (err != null) {
                console.log("err in getIssues: " + err);
                callback("");
            } else {
                result.issues = res;
                result.full = repo.full;
                result.owner = repo.owner;
                result.repo = repo.repo;
                callback(result);
            }
        });
    },
    CreateIssue: function (username, password, owner, repo, title, body, callback) {

        var g = new GitHubApi({
            debug: debug,
            protocol: "https",
            host: "api.github.com",
            headers: {
                "user-agent": "automat-BAP"
            },
            Promise: require('bluebird'),
            followRedirects: false,
            timeout: 5000
        });

        g.authenticate({
            type: "basic",
            username: username,
            password: password
        });

        g.issues.create({
            owner: owner,
            repo: repo,
            title: title,
            body: body
        }, function (err, res) {
            if (err != null) {
                console.log("err in issues.create: " + err);
                callback(false);
            } else {
                callback(true);
            }
            });
    },
    CloseIssue: function (username, password, owner, repo, number, state, callback) {

        var g = new GitHubApi({
            debug: debug,
            protocol: "https",
            host: "api.github.com",
            headers: {
                "user-agent": "automat-BAP"
            },
            Promise: require('bluebird'),
            followRedirects: false,
            timeout: 5000
        });

        g.authenticate({
            type: "basic",
            username: username,
            password: password
        });

        g.issues.edit({
            owner: owner,
            repo: repo,
            number: number,
            state: state
        }, function (err, res) {
            if (err != null) {
                console.log("error in closing issue: " + err);
                callback(false);
            } else {
                callback(true);
            }
            });
    },
    getComments: function (username, password, owner, repo, number, callback) {

        var g = new GitHubApi({
            debug: debug,
            protocol: "https",
            host: "api.github.com",
            headers: {
                "user-agent": "automat-BAP"
            },
            Promise: require('bluebird'),
            followRedirects: false,
            timeout: 5000
        });

        g.authenticate({
            type: "basic",
            username: username,
            password: password
        });

        g.issues.getComments({
            owner: owner,
            repo: repo,
            number: number
        }, function (err, res) {
            if (err != null) {
                console.log("error in getComments: " + err);
            } else {
                callback(res);
            }
        });
    },
    createComment: function (username, password, owner, repo, number, body, callback) {

        var g = new GitHubApi({
            debug: debug,
            protocol: "https",
            host: "api.github.com",
            headers: {
                "user-agent": "automat-BAP"
            },
            Promise: require('bluebird'),
            followRedirects: false,
            timeout: 5000
        });

        g.authenticate({
            type: "basic",
            username: username,
            password: password
        });

        g.issues.createComment({
            owner: owner,
            repo: repo,
            number: number,
            body: body
        }, function (err, res) {
            if (err != null) {
                callback(false);
                console.log("error in createComments: " + err);
            } else {
                callback(true);
            }
        });
    }
};