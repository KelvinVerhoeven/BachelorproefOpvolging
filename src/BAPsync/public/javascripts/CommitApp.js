var app = angular.module('CommitApp', ['ngCookies']);

app.controller("CommitCtrl",
[
    "$cookies", "$scope", "$http", "$window", function ($cookies, $scope, $http, $window) {

        $scope.docent;

        $scope.navigation = function (link) {
            var host = $window.location.host;
            var result = "https://" + host + "/" + link;
            $window.location.href = result;
        }

       
        var init = function() {
            if ($cookies.get("username") == undefined) {
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


        }
        init();
    }
]);