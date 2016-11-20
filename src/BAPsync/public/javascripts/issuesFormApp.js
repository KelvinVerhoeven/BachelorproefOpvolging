var app = angular.module('issuesFormApp', ['ngCookies']);

app.controller("IssuesFormCtrl", ["$cookies", "$scope", "$http", "$window", function ($cookies, $scope, $http, $window) {


    $scope.submitIssue = function (title, text) {

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = { username: $cookies.get("username"), password: $cookies.get("password"), student: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo"), title: title, body: text };

        $http.post("/issues/create", dataToSend, config)
            .success(function (data, status, headers, config) {
                if (data.done == true) {
                    $window.location.href = "/issues";
                }
            })
            .error(function (data, status, header, config) {
                console.log("Failed " + data);
                confirm("update failed");
            })
    }

    var init = function () {

        if ($cookies.get("currentStudent") == undefined || $cookies.get("currentRepo") == undefined) {
            $window.location.href = "/overview";
        }
        if ($cookies.get("username") == undefined || $cookies.get("password") == undefined) {
            $window.location.href = "/login";
        }


    }

    init();
}]);