'use strict';

var app = angular.module('search.services', []);

app.service('Search', ['$http', 'RESTURL', function($http, RESTURL){
	this.search = function(str) {
		 return $http({
                method: 'GET',
                url: RESTURL + '/v1/search?q=' + str +  '&collection=bugs'
            });
	};

}]);