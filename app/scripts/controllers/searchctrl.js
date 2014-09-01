'user strict';

var app = angular.module('search.controllers', []);

app.controller('searchCtrl', ['$rootScope','$scope', 'Search', 'Flash', function($rootScope, $scope, Search, Flash){
		$scope.q = '';
		$scope.search = function() {
			return Search.bugs($scope.q).then(function(response) {
				console.log(response);
				$scope.results = response.data;
				$rootScope.$broadcast('search',  {
					searchResults: response.data.results
				});
				Flash.addAlert('success', 'Returned ' + $scope.results.total + ' results');
			}, function(response) {
				Flash.addAlert('danger', response.status + ' :error occured');
			});
		};

}]); 