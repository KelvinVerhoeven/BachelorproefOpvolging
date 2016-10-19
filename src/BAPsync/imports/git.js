//github methods
var GitHubApi = require("github");

var debug = true
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
        });

        if (debug) {
            console.log("user: " + username + " authenticated");
        }
    }
};