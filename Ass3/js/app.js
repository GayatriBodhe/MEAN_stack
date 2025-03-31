// Define the AngularJS application
var app = angular.module("myApp", []);

// Define the Controller
app.controller("myController", function($scope) {
    $scope.showAlert = function() {
        alert("Button clicked! This is an ng-click alert.");
    };
});
