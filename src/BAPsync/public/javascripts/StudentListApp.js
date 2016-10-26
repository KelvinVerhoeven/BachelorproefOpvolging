var app = angular.module('studentListApp', ['ngCookies']);

app.controller("studentListCtrl", ["$cookies", "$scope", "$http", "$window", function ($cookies, $scope, $http, $window) {

    //scopes var
    $scope.students = [];
    //$scope.currentSubList = [];

    //scope functions
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

                    $scope.students[student].subbed = "unsubscriped";
                    //do Post
                    break;
                } else {

                    subscriptionListAdd(student, fullLink);
                    break;
                }
            }
        }
        $scope.students = students;
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
        var dataToSend = { username: $cookies.get("username") };

        $http.post("/subscriptionList", dataToSend, config)
            .success(function (data, status, headers, config) {
                var temp = []; //to make it an array
                temp.push(data);
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
                if (studentsDB[stud].full == currentSubList[currentsub].studentRepo) {
                    sub = true;
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
        var dataToSend = { username: $cookies.get("username"), studentRepo: studentRepo };

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

    init();
}]);