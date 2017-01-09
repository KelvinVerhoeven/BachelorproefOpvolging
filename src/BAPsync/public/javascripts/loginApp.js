var app = angular.module('loginApp', ['ngCookies']);



app.controller("loginCtrl", ["$cookies", "$scope", "$http", "$window", "$sce", function ($cookies, $scope, $http, $window, $sce) {
    $scope.hasError = null;

    $scope.login = function (username, password) {
        var dataToSend = JSON.stringify({
            "username": username,
            "password": password
        });

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        $http.post("/login", dataToSend, config)
            .success(function (data, status, headers, config) {

                if (data.auth == true) {
                    //cookies
                    $cookies.put("username", username, ["secure", "true"]);

                    //redirect
                    var host = $window.location.host;
                    var result = "https://" + host + data.redirect;
                    $window.location.href = result;
                } else {
                    $scope.hasError = "has-error";
                }
            })
            .error(function (data, status, header, config) {

                console.log("Failed " + data);
                response = data;
            })
    }

    var init = function () {

        $cookies.remove("connect.sid");
        $cookies.remove("currentRepo");
        $cookies.remove("currentStudent");
        $cookies.remove("username");
    }

    init();
}]);