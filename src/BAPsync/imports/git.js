//github methods
var GitHubApi = require("github");
var fs = require("fs");
var config = require("./config.js");

var debug = config.debug;
var tok = config.bot.gitToken;
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
        github.authenticate({
            type: "basic",
            username: username,
            password: password
        }, function (err, res) {
            if (err != null) {
                return false;
            } else {
                return true;
            }
            });

        if (debug) {
            console.log("user: " + username + " authenticated");
        }
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

        //g.users.getTeams({ //finding my team id
        //}, function (err, res) {
        //    fs.writeFile("././debug/getTeams.txt", JSON.stringify(res, null, "\n"));
        //    })

        g.orgs.getTeamRepos({ // getting my team repo
            id: "2138835" //private team id containing the test repo
        }, function (err, res) {
            fs.writeFile("././debug/getTeamRepos.txt", JSON.stringify(res, null, "\n"));

            //g.repos.get({
            //    owner: res.owner.login,
            //    repos: res.name
            //}, function (err, res) {
            //    fs.writeFile("././debug/getRepoforuser.txt", JSON.stringify(res, null, "\n"));
            //});

            callback(res);
        });

        //g.repos.getForOrg({ //normally you scan here. But the test repo has to be found elsewhere
        //    org: organisatie
        //}, function (err, res) {
        //    if (debug) {
        //        fs.writeFile("././debug/orgList.txt", JSON.stringify(res, null, "\n"));
        //    }
        //    callback(res);
        //}); 
    }
};