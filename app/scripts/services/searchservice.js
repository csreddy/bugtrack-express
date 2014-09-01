'use strict';

var app = angular.module('search.services', []);

app.service('Search', ['$http', 'RESTURL', function($http, RESTURL){
	this.bugs = function(str) {
		 return $http({
                method: 'GET',
                url: RESTURL + '/v1/search?q=' + str +  '&collection=bugs&pageLength=100'
            });
	};

	this.users = function(str) {
		 return $http({
                method: 'GET',
                url: RESTURL + '/v1/search?q=' + str +  '&collection=users&pageLength=100'
            });
	};

}]);