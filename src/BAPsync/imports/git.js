//github methods
var GitHubApi = require("github");
var fs = require("fs");
var config = require("./config.js");
var id = require("./key.js");

var debug = config.debug;


var github = new GitHubApi({
    debug: true,
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
    GetBachelorRepos: function () {

        var g = new GitHubApi({
            debug: true,
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
            token: JSON.stringify(id)
        }, function (err, res) {
            if (err != null) {
                console.log("bot login with token error: " + err);
            }
            });

        console.log("getting org repos with bot");
        g.repos.getForOrg({
            org: "AP-Elektronica-ICT"
        }, function (err, res) {
            if (debug) {
                fs.writeFileSync("././debug/orgList.txt", JSON.stringify(res, null, "\n"));
            }
            return res;
        }); 
    }
};