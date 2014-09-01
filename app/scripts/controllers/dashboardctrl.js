'use strict';

var app = angular.module('dashboard.controllers', ['ui.bootstrap']);

app.controller('dashboardCtrl', ['$scope','$http', function($scope, $http){
		$scope.msg = 'this is dashboard';
}]);