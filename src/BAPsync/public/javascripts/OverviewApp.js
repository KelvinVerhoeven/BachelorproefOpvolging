var app = angular.module('OverviewApp', ['ngCookies']);

app.controller("overviewCtrl", ["$cookies", "$scope", "$http", "$window", function ($cookies, $scope, $http, $window) {       

    $scope.students = [];

    $scope.navigation = function (link) {
        var host              = $window.location.host;
        var result            = "https://" + host + "/" + link;
        $window.location.href = result;
    }

    var init = function () {
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
        var dataToSend = {};

        $http.post
    }

    var getOverview = function () {
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = { username: $cookies.get("username") };


    }
}])