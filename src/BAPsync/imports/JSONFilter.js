var config = require("./config.js");
var fs = require("fs");
var path = require("path");

var debug = config.debug;
var BAPRepoFilterWord = config.BAP.filter;

module.exports = {
    FilterBAPS: function (repoList, callback) {

        var results = [];

        if (debug) {
            console.log("starting to filter the repos on name");
            fs.writeFile(path.join(__dirname, "././debug/reposAP.txt"), JSON.stringify(repoList, null, "\n"));
        }
        for (var repo in repoList) {
            if (typeof repoList[repo] != "undefined" && repo != "meta") {
                var repoName = repoList[repo].name;
                var index = repoName.indexOf(BAPRepoFilterWord);
                if (index != -1) {
                    results.push(repoList[repo]);
                }
            }
        }
        if (debug) {
            console.log("parsed " + results.length + " repositories");
        }
        callback(results);
    }
};