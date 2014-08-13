'user strict';

var app = angular.module('search.controllers', []);

app.controller('searchCtrl', ['$scope', 'Search', 'Flash', function($scope, Search, Flash){
		$scope.q = 'test';
		$scope.search = function() {
			return Search.search($scope.q).then(function(response) {
				console.log(response);
				$scope.results = response.data;
				Flash.addAlert('success', 'returned ' + $scope.results.total + ' results');
			}, function(response) {
				Flash.addAlert('danger', response.status + ' :error occured');
			});
		};

}]);