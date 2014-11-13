'user strict';

var app = angular.module('search.controllers', []);

app.controller('searchCtrl', ['$rootScope', '$scope', 'Search', 'Flash', 'bugConfigFactory',
    function($rootScope, $scope, Search, Flash, bugConfigFactory) {
        $scope.q = '';
        $scope.config = {};
        $scope.form = {};
        bugConfigFactory.getConfig().then(function(response) {
            console.log(response.data);
            $scope.config = response.data;

            //    $scope.submittedBy = $scope.config.users;
            //   $scope.tofixin = $scope.config.version;
            //  $scope.fixedin = $scope.config.version;

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



            // create model variables from on config.kind to generate form fields
            angular.forEach($scope.config.kind, function(value, index) {
                $scope.config.kind.splice(index, 1, {
                    name: value,
                    selected: false
                });
            });
            // create model variables from config.status to generate form fields
            angular.forEach($scope.config.status, function(value, index) {
                $scope.config.status.splice(index, 1, {
                    name: value,
                    selected: false
                });
            });
            // create model variables from config.severity to generate form fields
            angular.forEach($scope.config.severity, function(value, index) {
                $scope.config.severity.splice(index, 1, {
                    name: value,
                    selected: false
                });
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



        $scope.form.setAssignedTo = function(assignTo) {
            $scope.assignTo = JSON.parse(assignTo);
        };

        $scope.from.setSubmittedBy = function(submittedBy) {
            $scope.submittedBy = JSON.parse(submittedBy);
        };

        $scope.form.setCategory = function(category) {
            $scope.category = category;
        };

        $scope.form.setVersion = function(version) {
            $scope.version = version;
        };

        $scope.setToFixin = function(tofixin) {
            $scope.tofixin = tofixin;
        };

        $scope.setFixedIn = function(fixedin) {
            $scope.fixedin = fixedin;
        };


        $scope.search = function() {

            var searchCriteria = {};
            searchCriteria.kind = [];
            searchCriteria.status = [];
            searchCriteria.severity = [];

            angular.forEach($scope.config.kind, function(obj, index) {
                if (obj.selected === true) {
                    searchCriteria.kind.push(obj.name);
                }
            });
            angular.forEach($scope.config.status, function(obj, index) {
                if (obj.selected === true) {
                    searchCriteria.status.push(obj.name);
                }
            });
            angular.forEach($scope.config.severity, function(obj, index) {
                if (obj.selected === true) {
                    searchCriteria.severity.push(obj.name);
                }
            });


            searchCriteria.q = $scope.q;

            if ($scope.assignTo) {
                searchCriteria.assignTo = $scope.assignTo;
            }

            if ($scope.submittedBy) {
                searchCriteria.submittedBy = $scope.submittedBy;
            }

            if ($scope.category) {
                searchCriteria.category = $scope.category;
            }

            if ($scope.version) {
                searchCriteria.version = $scope.version;
            }

            if ($scope.tofixin) {
                searchCriteria.tofixin = $scope.tofixin;
            }

            if ($scope.fixedin) {
                searchCriteria.fixedin = $scope.fixedin;
            }

            console.log("---------", searchCriteria);

            return Search.search(searchCriteria).success(function(response) {
                console.log(response);
                $scope.results = response;
                $rootScope.$broadcast('search', {
                    searchResults: response
                });
                Flash.addAlert('success', 'Returned ' + $scope.results[0].results.length + ' results');
            }).error(function(response) {
                Flash.addAlert('danger', response.status + ' :error occured');
            });
        };

        $scope.clear = function() {
            console.log('clear fields');
            $scope.q = '';
             $scope.searchForm.$setPristine();
        };



    }
]);


app.controller('facetCtrl', ['$scope', 'Flash', '$http', 'BugService',
    function($scope, Flash, $http, BugService) {
        $scope.test = 'Facet controller';
        return BugService.getFacets().success(function(response) {
            console.log(response);
            $scope.facets = response;
        }).error(function(response) {
            Flash.addAlert('danger', response + ' :error occured');
        });
    }
]);