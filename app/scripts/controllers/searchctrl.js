'user strict';

var app = angular.module('search.controllers', []);

app.controller('searchCtrl', ['$rootScope','$scope', 'Search', 'Flash', 'bugConfigFactory',function($rootScope, $scope, Search, Flash, bugConfigFactory){
		$scope.q = '';
        $scope.config = {};
        bugConfigFactory.getConfig().then(function(response) {
        	console.log(response.data);
        	$scope.config = response.data;		
        });
        
		$scope.showMore = true;
		$scope.showAdvancedSearch = function() {	
			if($scope.showMore){
				$scope.showMore = false;
			} else {
				$scope.showMore = true;
			}
		};

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


app.controller('facetCtrl', ['$scope', 'Flash', '$http', 'BugService',function($scope, Flash, $http, BugService){
	$scope.test = 'Facet controller';
	return BugService.getFacets().success(function(response) {
        		console.log(response);
        		$scope.facets = response;
        }).error(function(response) {
        		Flash.addAlert('danger', response + ' :error occured');
        });
}]);

