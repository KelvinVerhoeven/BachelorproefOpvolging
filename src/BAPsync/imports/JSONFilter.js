var config = require("./config.js");

var debug = config.debug;
var BAPRepoFilterWord = config.BAP.filter;

module.exports = {
    FilterBAPS: function (repoList, callback) {

        var results = [];

        if (debug) {
            console.log("starting to filter the repos on name");
        }
        for (var repo in repoList) {
            console.log(repoList[repo].name);
            if (typeof repoList[repo] != "undefined" && repo != "meta") {
                var repoName = repoList[repo].name;
                var index = repoName.indexOf(BAPRepoFilterWord);
                if (index != -1) {
                    results.push(repoList[repo]);
                }
            }
        }
        callback(results);
    }
};