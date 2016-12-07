var app = angular.module('OverviewApp', ['ngCookies']);

app.controller("overviewCtrl",
[
<<<<<<< HEAD
    "$cookies", "$scope", "$http", "$window", "$rootScope", function ($cookies, $scope, $http, $window, $rootScope) {


        $scope.students = [];
        $scope.docent;
        var date = new Date();
        $scope.date = date;
        

        $scope.navigation = function(link) {
            var host = $window.location.host;
            var result = "https://" + host + "/" + link;
            $window.location.href = result;
        }

        var eventFooter = function () {
            //fire event
            var args = [];
            args.student = $cookies.get("currentStudent");
            args.repo = $cookies.get("currentRepo");
            $rootScope.$broadcast('chooseStudent', args);
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
                        $scope.problemName = "De student heeft zijn echte naam niet in de repo gezet!";
                    } else {
                        $scope.problemName = null;
                    }
                    
                })
                .error(function (data, status, header, config) {
                    console.log("Failed! " + data);
                });
        }

        var userMail = function() {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            var dataToSend = { username: $cookies.get("username"), password: $cookies.get("password"), student: $cookies.get("currentStudent") };

            $http.post("/user/get", dataToSend, config)
                .success(function (data, status, headers, config) {
                    $scope.mail = data.email;
                })
                .error(function (data, status, headers, config) {
                    console.log("get user failed: " + data);
                });
        }

        var numCommits = function() {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            var dataToSend = { username: $cookies.get("username"), password: $cookies.get("password"), student: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo") };

            $http.post("/commit/get", dataToSend, config)
                .success(function (data, status, headers, config) {
                    $scope.numCommits = data.length;
                })
                .error(function (data, status, headers, config) {
                    console.log("get commits failed: " + data);
                });
        }

        $scope.chooseStudent = function (full) {
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
                    $cookies.put("currentStudent", data.owner, ["secure", "true"]);
                    $cookies.put("currentRepo", data.repo, ["secure", "true"]);
                    getRepos();
                    numCommits();
                    userMail();
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

        var localSelection = function (full) {

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
                    $cookies.put("currentStudent", data.owner, ["secure", "true"]);
                    $cookies.put("currentRepo", data.repo, ["secure", "true"]);
                    getRepos();
                    numCommits();
                    eventFooter();

                })
                .error(function (data, status, header, config) {
                    console.log("Failed! " + data);
                });
        }

        $scope.open = function () {
            $window.location.href = "/issues";
        }

        $scope.chooseStudent = function(full) {
            localSelection(full);
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
                        localSelection($scope.students[0].studentRepo);
                    } else {
                        getRepos();
                        numCommits();
                        eventFooter();
                    }
                    
                })
                .error(function (data, status, header, config) {
                    console.log("Failed " + data);
                });   
        }

        init();
    }]);

app.controller("overviewFootCtrl", ["$cookies", "$scope", "$http", "$window", "$sce", function ($cookies, $scope, $http, $window, $sce) {

    $scope.logs;

    $scope.$on('chooseStudent', function (event, args) {
        init(args);
    });

    var init = function (args) {
        if ($cookies.get("username") == undefined) {
            var host = $window.location.host;
            var result = "https://" + host + "/login";
            $window.location.href = result;
        }

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = {
            username: $cookies.get("username"), password: $cookies.get("password"),
            //owner: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo")
            owner: args.student, repo: args.repo
        };

        $http.post("/log/get", dataToSend, config)
            .success(function (data, status, header, config) {
                
                $scope.logs = $sce.trustAsHtml(data); 
            })
            .error(function (data, status, header, config) {
                console.log("Failed! " + data);
            });
    }

}]);