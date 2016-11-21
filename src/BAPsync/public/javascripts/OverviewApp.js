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

        $scope.chooseStudent = function(full) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            var dataToSend = {
                "full": full
        };

            $http.post("/overview/get", dataToSend, config)
                .success(function(data, status, header, config) {
                    $scope.name = data.owner;
                    $cookies.put("currentStudent", data.owner, ["secure", "true"]);
                    $cookies.put("currentRepo", data.repo, ["secure", "true"]);
                    getRepos();

                })
                .error(function(data, status, header, config) {
                    console.log("Failed! " + data);
                });

            
        }

        var getRepos = function() {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            var dataToSend = {
                username: $cookies.get("username"), password: $cookies.get("password"),
                owner: $cookies.get("currentStudent"), repo:$cookies.get("currentRepo")
            };
            $http.post("/repos/get", dataToSend, config)
                .success(function(data, status, header, config) {
                    $scope.repolink = data.html_url;
                })
                .error(function(data, status, header, config) {
                    console.log("Failed! " + data);
                });
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
            var dataToSend = { username: $cookies.get("username") };

            $http.post("/subscriptionList", dataToSend, config)
                .success(function (data, status, headers, config) {
                    $scope.students = data;
                })
                .error(function (data, status, header, config) {
                    console.log("Failed " + data);
                });

            /*var dataToSend2 = {
                username: $cookies.get("username"), password: $cookies.get("password"),
                owner: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo")
            };

            $http.post("/repos/get", dataToSend2, config)
                .success(function (data, status, header, config) {
                    $scope.name = data;
                })
                .error(function (data, status, header, config) {
                    console.log("Failed! " + data);
                });*/
        }

        init();
}]);