var app = angular.module('OverviewApp', ['ngCookies']);

app.controller("overviewCtrl",
[
    "$cookies", "$scope", "$http", "$window", function($cookies, $scope, $http, $window) {

        $scope.students = [];
        $scope.docent;

        $scope.navigation = function(link) {
            var host = $window.location.host;
            var result = "https://" + host + "/" + link;
            $window.location.href = result;
        }

        /*

        var getSubList = function(studentsDB) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            var dataToSend = { username: $cookies.get("username") };

            $http.post("/overview/get", dataToSend, config)
                .success(function (data, status, headers, config) {
                    var temp = data;
                    //temp.push(data);
                    checkSubs(studentsDB, temp);
                })
                .error(function (data, status, header, config) {
                    console.log("Failed " + data);
                })
        }*/

        

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
            var dataToSend = { username: $cookies.get("username") };

            $http.post("/subscriptionList", dataToSend, config)
                .success(function (data, status, headers, config) {
                    $scope.students = data;
                    console.log("lel");
                })
                .error(function (data, status, header, config) {
                    console.log("Failed " + data);
                });
        }

        init();
}]);