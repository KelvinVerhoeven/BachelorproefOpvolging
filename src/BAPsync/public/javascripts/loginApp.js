var app = angular.module('loginApp', ['ngCookies']);



app.controller("loginCtrl", ["$cookies", "$scope", "$http", "$window", function ($cookies, $scope, $http, $window) {

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
                }
            })
            .error(function (data, status, header, config) {

                console.log("Failed " + data);
                response = data;
            })
    }
}]);