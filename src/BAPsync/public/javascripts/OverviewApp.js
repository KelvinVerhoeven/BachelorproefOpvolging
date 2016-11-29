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

        var getRepos = function () {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            var dataToSend = {
                username: $cookies.get("username"), password: $cookies.get("password"),
                owner: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo")
            };
            $http.post("/repos/get", dataToSend, config)
                .success(function (data, status, header, config) {
                    $scope.repolink = data.html_url;
                    $scope.laatsteCommit = data.pushed_at;
                    $scope.openIssues = data.open_issues_count;
                    $scope.name = data.description;

                    if ($scope.name == null) {
                        $scope.problem = "De student heeft zijn echte naam niet in de repo gezet!";
                    } else {
                        $scope.problem = null;
                    }
                })
                .error(function (data, status, header, config) {
                    console.log("Failed! " + data);
                });
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
                    //$scope.name = data.owner;
                    $cookies.put("currentStudent", data.owner, ["secure", "true"]);
                    $cookies.put("currentRepo", data.repo, ["secure", "true"]);
                    getRepos();

                })
                .error(function(data, status, header, config) {
                    console.log("Failed! " + data);
                });

            
        }

        $scope.open = function () {
            $window.location.href = "/issues";
        }

        $scope.opencommits = function() {
            $window.location.href = "/commit";
        }

        var chooseStudent = function (full) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            var dataToSend = {
                "full": full
            };

            $http.post("/overview/get", dataToSend, config)
                .success(function (data, status, header, config) {
                    $scope.name = data.owner;
                    $cookies.put("currentStudent", data.owner, ["secure", "true"]);
                    $cookies.put("currentRepo", data.repo, ["secure", "true"]);
                    getRepos();

                })
                .error(function (data, status, header, config) {
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
                    var count = Object.keys(data).length;
                    if (count == 0) {
                        $window.location.href = "/studentList";
                    }
                    if ($cookies.get("currentStudent") == undefined && $cookies.get("currentRepo") == undefined) {
                        chooseStudent($scope.students[0].studentRepo);
                    } else {
                        getRepos();
                    }
                    
                })
                .error(function (data, status, header, config) {
                    console.log("Failed " + data);
                });

            /*var dataToSend2 = {
                "full": full
            };

            $http.post("/overview/get", dataToSend2, config)
                .success(function (data, status, header, config) {
                    $scope.name = data.owner;
                    $cookies.put("currentStudent", data.owner, ["secure", "true"]);
                    $cookies.put("currentRepo", data.repo, ["secure", "true"]);
                    getRepos();

                })
                .error(function (data, status, header, config) {
                    console.log("Failed! " + data);
                });*/
        }

        init();
}]);