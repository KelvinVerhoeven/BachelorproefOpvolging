﻿var app = angular.module('commitApp', ['ngCookies']);

app.controller("commitCtrl",
[
    "$cookies", "$scope", "$http", "$window", function ($cookies, $scope, $http, $window) {

        $scope.docent;
        $scope.commits;

        $scope.navigation = function (link) {
            var host = $window.location.host;
            var result = "https://" + host + "/" + link;
            $window.location.href = result;
        }

       
        var init = function() {

            $scope.docent = $cookies.get("username");

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            var dataToSend = {student: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo") };

            $http.post("/commit/get", dataToSend, config)
                .success(function (data, status, headers, config) {
                    $scope.commits = data;
                    $scope.numCommits = data.length;
                    if (data.length < 2) {
                        $scope.s = "";
                    } else {
                        $scope.s = "s";
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log("get commits failed: " + data);
                });
        }
        init();
}]);