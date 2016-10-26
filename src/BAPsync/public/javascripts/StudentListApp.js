var app = angular.module('studentListApp', ['ngCookies']);

app.controller("studentListCtrl", ["$cookies", "$scope", "$http", "$window", function ($cookies, $scope, $http, $window) {

    //scopes var
    $scope.students = [];

    //scope functions
    $scope.navigation = function (link) {
        var host = $window.location.host;
        var result = "https://" + host + "/" + link;
        $window.location.href = result;
    }

    //functions
    var init = function () {

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = {};

        $http.post("/studentsList/get", dataToSend, config)
            .success(function (data, status, headers, config) {

                $scope.students = data;

            })
            .error(function (data, status, header, config) {
                console.log("Failed " + data);
                response = data;
            })
    }

    init();
}]);