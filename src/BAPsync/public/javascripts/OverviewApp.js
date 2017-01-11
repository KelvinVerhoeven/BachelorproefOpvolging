var app = angular.module('OverviewApp', ['ngCookies', 'chart.js']);

app.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        chartColors: ['#FDB45C'],
        responsive: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 6
                }
            }]
        }
    });
    ChartJsProvider.setOptions('doughnut', {
        chartColors: ['#4D5360', '#DCDCDC'],
        cutoutPercentage: 0,
        animation: {
            animateScale: true
        },
        scales: {
            gridLines: {
            display: false
            }
        }
        
    });
}]);

app.controller("overviewCtrl",
[
    "$cookies", "$scope", "$http", "$window", "$rootScope", "$timeout", "$sce", function ($cookies, $scope, $http, $window, $rootScope, $timeout, $sce) {

        $scope.fullName;
        $scope.info;
        $scope.laatsteCommit;
        $scope.openIssues;
        $scope.timeAgo;
        $scope.numCommits;
        $scope.repolink;
        $scope.alertScriptie;
        $scope.alertInfo;
        $scope.errorInfo;
        $scope.students = [];
        $scope.docent;
        $scope.clock;
        $scope.tickInterval = 1000;
        $scope.labelI = ["Issues"];
        $scope.labelC = ["Commits"];
        $scope.labelD = ["TimeAgo", "Left"];

        var tick = function() {
            $scope.clock = Date.now();
            $timeout(tick, $scope.tickInterval);
        }
        $timeout(tick, $scope.tickInterval);

        var timeNow = new Date();

        

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
                owner: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo")
            };
            $http.post("/repos/get", dataToSend, config)
                .success(function (data, status, header, config) {
                    $scope.repolink = data.html_url;
                    $scope.laatsteCommit = data.pushed_at;
                    $scope.openIssues = data.open_issues_count;
                    $scope.fullName = data.full_name;
                    //calculate if last commit is older than a given time
                    var timeString = timeNow.toString();
                    var diff = Date.parse(timeString) - Date.parse(data.pushed_at);
                    var timeDiff = diff / (1000 * 60 * 60 * 24);

                    if (timeDiff <= 7) {
                        $scope.alertCommit = "";
                        $scope.alertCommit = "alert alert-success";
                    } else if (timeDiff > 7 && timeDiff <= 14) {
                        $scope.alertCommit = "";
                        $scope.alertCommit = "alert alert- warning";
                    } else if (timeDiff > 14) {
                        $scope.alertCommit = "";
                        $scope.alertCommit = "alert alert-danger";
                    }

                    var date = new Date(diff);
                    var str = '';
                    str += date.getUTCDate() - 1 + " days, ";
                    str += date.getUTCHours() + " hours, ";
                    str += date.getUTCMinutes() + " minutes ";
                    $scope.timeAgo = str + " ago";
                    $scope.timeAgo = str;
                    var chartDiff = Math.round(timeDiff * 100) / 100;
                    var weekChartDiff = 7 - chartDiff;
                    var roundDiff = Math.round(weekChartDiff * 100) / 100;
                    

                    $scope.dataI = [data.open_issues_count];
                    $scope.dataD = [chartDiff, (roundDiff)];
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
                owner: $cookies.get("currentStudent"),
                repo: $cookies.get("currentRepo")
            };

            $http.post("/info/get", dataToSend, config)
            
                .success(function(data, status, headers, config) {
                    
                    if (data == false) {
                        $scope.info = "";
                        $scope.alertInfo = "alert alert-danger";
                    } else if (data.name == null ||
                        data.promotor == null ||
                        data.email == null ||
                        data.company == null) {
                        $scope.alertInfo = "alert alert-warning";
                        $scope.info = data;
                    } else {
                        $scope.info = data;
                        $scope.alertInfo = "alert alert-success";
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

            var dataToSend = { student: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo") };

            $http.post("/commit/get", dataToSend, config)
                .success(function (data, status, headers, config) {
                    $scope.numCommits = data.length;
                    $scope.dataC = [data.length];
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
                owner: $cookies.get("currentStudent"), repo: $cookies.get("currentRepo")
            };

            $http.post("/scriptie/get", dataToSend, config)
                .success(function (data, status, header, config) {

                    if (data.ok == undefined) {
                        $scope.alertScriptie = "alert alert-success";
                        var part1 = "<p>Scriptie: <a href=\"";
                        var part2 = data;
                        var part3 = "\" class=\"alert-link\" target=\"_blank\">";
                        var part4 = data;
                        var part5 = "</a></p>";
                        $scope.scriptieLink = $sce.trustAsHtml(part1 + part2 + part3 + part4 + part5);
                    } else {
                        $scope.alertScriptie = "alert alert-danger";
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

        $scope.idSelectedStudent = null;
        $scope.setSelected = function (idSelectedStudent) {
            $scope.idSelectedStudent = idSelectedStudent;
        }

        $scope.chooseStudent = function(full) {
            localSelection(full);
            
        }

        
        

        var init = function () {

            $scope.docent = $cookies.get("username"); //rip

            
            

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            var dataToSend = {};

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

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = {
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

