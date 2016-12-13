var app = angular.module('OverviewApp', ['ngCookies']);

app.controller("overviewCtrl",
[
    "$cookies", "$scope", "$http", "$window", "$rootScope", "$sce", function ($cookies, $scope, $http, $window, $rootScope, $sce) {


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
                    //$scope.name = data.description;
                    
                })
                .error(function (data, status, header, config) {
                    console.log("Failed! " + data);
                });
        }

        var getInfo = function() {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            var dataToSend = {
                username: $cookies.get("username"),
                password: $cookies.get("password"),
                owner: $cookies.get("currentStudent"),
                repo: $cookies.get("currentRepo")
            };

            $http.post("/info/get", dataToSend, config)
            
                .success(function(data, status, headers, config) {
                    
                    if (data == false) {
                        $scope.info = "";
                        $scope.errorInfo = "errorInfo";
                    } else {
                        $scope.info = data;
                        $scope.errorInfo = "";
                    }
                    
                })
                .error(function(data, status, headers, config) {
                    console.log("get info failed: " + data);
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

        var getScriptieLink = function () {

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            var dataToSend = {
                username: $cookies.get("username"), password: $cookies.get("password"),
                owner: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo")
            };

            $http.post("/scriptie/get", dataToSend, config)
                .success(function (data, status, header, config) {

                    if (data.ok == undefined) {
                        var part1 = "<p>Scriptie: <a href=\"";
                        var part2 = data;
                        var part3 = "\" class=\"alert-link\" target=\"_blank\">";
                        var part4 = data;
                        var part5 = "</a></p>";
                        $scope.scriptieLink = $sce.trustAsHtml(part1 + part2 + part3 + part4 + part5);
                    } else {
                        $scope.scriptieLink = $sce.trustAsHtml("<p class=\"notFound\">Sciptie not found!</p>");
                    }
                })
                .error(function (data, status, header, config) {
                    console.log("Failed! " + "lots of pdf data :p");
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
                    getInfo();
                    numCommits();
                    eventFooter();
                    getScriptieLink();
                    
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
                        getInfo();
                        numCommits();
                        eventFooter();
                        getScriptieLink();
                        
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