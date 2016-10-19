var app = angular.module('loginApp', []);

app.controller('wifiCtrl', function($scope, $http, $window) {
    
    $scope.response = [];
	$scope.login = function (username, password) {
        console.log("logging in: " + username);
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
        .success(function (data,status,headers,config) {
            console.log("recieved loginPost: " + data);
            var host = $window.location.host;
            var result = "https://" + host + data;
            $window.location.href = result;
        })
        .error(function (data,status,header,config) {
            console.log("Failed " + data);
            response = data;
        })
	}
});