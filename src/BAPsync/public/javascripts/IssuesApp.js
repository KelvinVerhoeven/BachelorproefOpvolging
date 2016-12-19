var app = angular.module('issuesApp', ['ngCookies']);

app.controller("IssuesCtrl", ["$cookies", "$scope", "$http", "$window", "$timeout", function ($cookies, $scope, $http, $window, $timeout) {

    $scope.docent;
    $scope.issues;
    $scope.clock = "time...";
    $scope.tickInterval = 1000;

    var tick = function () {
        $scope.clock = Date.now();
        $timeout(tick, $scope.tickInterval);
    }
    $timeout(tick, $scope.tickInterval);

    $scope.navigation = function (link) {
        var host = $window.location.host;
        var result = "https://" + host + "/" + link;
        $window.location.href = result;
    }

    $scope.newComment = function (number, commentText) {

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = { username: $cookies.get("username"), password: $cookies.get("password"), student: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo"), number: number, body: commentText };

        $http.post("/comments/new", dataToSend, config)
            .success(function(data, status, headers, config) {
                if (data.done == true) {
                    init();
                }
            })
            .error(function(data, status, header, config) {
                console.log("Failed " + data);
                confirm("update failed");
                init();
            });

    }


    $scope.closeIssue = function (number) {

        if (confirm("Pressing yes is going to close and hide the issue!") == true) {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            var dataToSend = { username: $cookies.get("username"), password: $cookies.get("password"), student: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo"), number: number, state: "closed" };

            $http.post("/issues/close", dataToSend, config)
                .success(function(data, status, headers, config) {
                    if (data.done == true) {
                        init();
                    }
                })
                .error(function(data, status, header, config) {
                    console.log("Failed " + data);
                });
        }

    }

    var postCommentURL = function (id, number) {

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        var dataToSend = { username: $cookies.get("username"), password: $cookies.get("password"), student: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo"), number: number };

        $http.post("/comments", dataToSend, config)
            .success(function(data, status, headers, config) {
                var temp; //to make it an array
                temp = data;
                $scope.issues[id].gotComments = temp;
            })
            .error(function(data, status, header, config) {
                console.log("Failed " + data);
            });
    }

    var getComments = function () {
        for (issue in $scope.issues) {
            postCommentURL(issue, $scope.issues[issue].number);
        }
    }

    

    var init = function () {

        //temp
        //$cookies.put("currentStudent", "jonathan2266", ["secure", "true"]);
        //$cookies.put("currentRepo", "bachelorproef-test1", ["secure", "true"]);

        if ($cookies.get("username") == undefined || $cookies.get("password") == undefined) {
            var host = $window.location.host;
            var result = "https://" + host + "/login";
            $window.location.href = result;
        }

        $scope.docent = $cookies.get("username");

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = { username: $cookies.get("username"), password: $cookies.get("password"), student: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo") };

        $http.post("/issues/get", dataToSend, config)
            .success(function (data, status, headers, config) {
                var temp; //to make it an array
                temp = data;
                $scope.issues = temp;
                getComments();
            })
            .error(function (data, status, header, config) {
                console.log("Failed " + data);
            })
    }

    init();
}]);