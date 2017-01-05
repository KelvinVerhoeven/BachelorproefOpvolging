var app = angular.module('studentListApp', ['ngCookies']);

app.controller("studentListCtrl", ["$cookies", "$scope", "$http", "$timeout", "$window", function ($cookies, $scope, $http, $timeout, $window) {

    //scopes var
    $scope.students = [];
    $scope.docent;

    $scope.clock = "time...";
    $scope.tickInterval = 1000;

    var tick = function () {
        $scope.clock = Date.now();
        $timeout(tick, $scope.tickInterval);
    }
    $timeout(tick, $scope.tickInterval);

    $scope.navigation = function (link) {
        var host = $window.location.host;
        var result = "https://" + host + "/" + link;
        $window.location.href = result;
    }
    $scope.selectStudent = function (fullLink) {

        for (student in $scope.students) {
            if ($scope.students[student].full == fullLink) {
                var sub = $scope.students[student].subbed;
                if (sub == "subscriped") {

                    subscriptionListRemove(student, fullLink); 
                    break;
                } else {

                    subscriptionListAdd(student, fullLink);
                    break;
                }
            }
        }
    }

    $scope.special = function (link) {

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = {};

        $http.post(link, dataToSend, config)
            .success(function (data, status, headers, config) {
                $scope.students = [];
                init();
            })
            .error(function (data, status, header, config) {
                console.log("Failed " + data);
            })
    }

    //functions
    var init = function () {
        console.log("called init");

        //clear cookies
        $cookies.remove("currentStudent");
        $cookies.remove("currentRepo");

        $scope.docent = $cookies.get("username"); //rip this too

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = {};

        $http.post("/studentsList/get", dataToSend, config)
            .success(function (data, status, headers, config) {

                getSubscriptionList(data);

            })
            .error(function (data, status, header, config) {
                console.log("Failed " + data);
            })

    }

    var getSubscriptionList = function (studentsDB) {

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = {};

        $http.post("/subscriptionList", dataToSend, config)
            .success(function (data, status, headers, config) {
                var temp; //to make it an array
                temp = data;
                checkSubs(studentsDB, temp);
            })
            .error(function (data, status, header, config) {
                console.log("Failed " + data);
            })
    }

    var checkSubs = function (studentsDB, currentSubList) {

        for (stud in studentsDB) {
            var sub = false;
            for (currentsub in currentSubList) {
                if (currentSubList[currentsub] != null) {
                    if (studentsDB[stud].full == currentSubList[currentsub].studentRepo) {
                        sub = true;
                    }
                }
            }

            var temp = [];
            temp.full = studentsDB[stud].full;
            temp.owner = studentsDB[stud].owner;
            temp.repo = studentsDB[stud].repo;
            if (sub) {
                temp.subbed = "subscriped";
            } else {
                temp.subbed = "unsubscriped";
            }
            $scope.students.push(temp);
        }

    }

    var subscriptionListAdd = function (student, studentRepo) {

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = {studentRepo: studentRepo };

        $http.post("/studentList/add", dataToSend, config)
            .success(function (data, status, headers, config) {

                if (data.done) {
                    $scope.students[student].subbed = "subscriped";
                }
                
                
            })
            .error(function (data, status, header, config) {
                console.log("Failed " + data);
            })
    }

    var subscriptionListRemove = function (student, studentRepo) {

        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var dataToSend = {studentRepo: studentRepo };

        $http.post("/studentList/remove", dataToSend, config)
            .success(function (data, status, headers, config) {
                if (data.done) {
                    $scope.students[student].subbed = "unsubscriped";
                }
            });
    }
    init();
}]);