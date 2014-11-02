'user strict';

var app = angular.module('search.controllers', []);

app.controller('searchCtrl', ['$rootScope', '$scope', 'Search', 'Flash', 'bugConfigFactory', 'User',
    function($rootScope, $scope, Search, Flash, bugConfigFactory, User) {

        $scope.config = {};
        $scope.form = {};
        $scope.form.q = '';
        $scope.form.facets = {};
        bugConfigFactory.getConfig().then(function(response) {
            console.log(response.data);
            $scope.config = response.data;


            // sort users alphabetically
            $scope.config.users.sort(function(a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
            // sort version alphabetically
            $scope.config.version.sort(function(a, b) {
                if (a > b) {
                    return 1;
                }
                if (a < b) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
            // sort category alphabetically
            $scope.config.category.sort(function(a, b) {
                if (a > b) {
                    return 1;
                }
                if (a < b) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });

        });


        // toggle advanced search visibility
        $scope.showMore = true;
        $scope.showAdvancedSearch = function() {
            if ($scope.showMore) {
                $scope.showMore = false;
            } else {
                $scope.showMore = true;
            }
        };



        $scope.setAssignedTo = function(assignTo) {
            $scope.form.assignTo = assignTo;
            console.log($scope.form.assignTo);
        };

        $scope.setSubmittedBy = function(submittedBy) {
            $scope.form.submittedBy = submittedBy;
        };

        $scope.setCategory = function(category) {
            $scope.form.category = category;
        };

        $scope.setVersion = function(version) {
            $scope.form.version = version;
        };

        $scope.setToFixin = function(tofixin) {
            $scope.form.tofixin = tofixin;
        };

        $scope.setFixedIn = function(fixedin) {
            $scope.form.fixedin = fixedin;
        };

        $scope.defaultSearch = function() {
        	User.getInfo().success(function(user) {
        		//$scope.form = {assignTo: user.username};	
        		$scope.form = {assignTo: 'lester', facets:  {}};	
        		$scope.search();
        	}).error(function(response) {
        		 Flash.addAlert('danger', response.status + ' error occured');
        	});
        	
        }; 


        $scope.search = function() {
            console.log($scope.form);

            return Search.search($scope.form).success(function(response) {
                console.log(response);
                $scope.results = response;
                $scope.facets = response[0].facets;
                console.log('facets', $scope.facets);
                $rootScope.$broadcast('search', {
                    searchResults: response,
                    searchCriteria: $scope.form
                });
                Flash.addAlert('success', 'Returned ' + ($scope.results.length - 1) + ' results');
            }).error(function(response) {
                Flash.addAlert('danger', response.status + ' :error occured');
            });
        };

        $scope.clear = function() {
            console.log('clear fields');
            $scope.q = '';
            $scope.form = {};
            $scope.searchForm.$setPristine();
        };



    }
]);


app.controller('facetCtrl', ['$scope', 'Flash', '$http', 'BugService', 'Search', '$rootScope',
    function($scope, Flash, $http, BugService, Search, $rootScope) {
        $scope.test = 'Facet controller';
        $scope.form = {};

        // get facets based on search response
        $scope.$on('search', function(event, data) {
             $scope.facetList = data.searchResults[0].facets;
             $scope.form = data.searchCriteria;
            console.log($scope.facets);
        });

        // filter results based on facets
        $scope.filter = function(facetKind, facet) {
        	console.log('$scope.form', $scope.form);
        	$scope.form.facets[facetKind] = facet;

        	 return Search.search($scope.form).success(function(response) {
                console.log(response);
                $scope.results = response;
                $scope.facetList = response[0].facets;
                $rootScope.$broadcast('search', {
                    searchResults: $scope.results,
                    searchCriteria: $scope.form
                });
                Flash.addAlert('success', 'Returned ' + ($scope.results.length - 1) + ' results');
            }).error(function(response) {
                Flash.addAlert('danger', response.status + ' :error occured');
            });
        };

        // remove filter 
        $scope.unfilter = function(facetKind) {
        	delete $scope.form.facets[facetKind];
		console.log('$scope.form from removeFacet', $scope.form);
        	 return Search.search($scope.form).success(function(response) {
                console.log(response);
                $scope.results = response;
                $scope.facetList = response[0].facets;
                $rootScope.$broadcast('search', {
                    searchResults: $scope.results,
                    searchCriteria: $scope.form
                });
                Flash.addAlert('success', 'Returned ' + ($scope.results.length - 1) + ' results');
            }).error(function(response) {
                Flash.addAlert('danger', response.status + ' :error occured');
            });

        };
    }
]);