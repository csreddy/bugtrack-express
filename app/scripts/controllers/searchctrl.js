'user strict';

var app = angular.module('search.controllers', []);

app.controller('searchCtrl', ['$rootScope', '$scope', '$location', 'Search', 'Flash', 'bugConfigFactory', 'currentUser', 'currentUserBugs',
    function($rootScope, $scope, $location, Search, Flash, bugConfigFactory, currentUser, currentUserBugs) {
        $scope.bugs = [];
        $scope.currentPage = 1;
        $scope.itemsPerPage = 25;
        $scope.config = {};
        $scope.form = {};

        $scope.defaultSearchCriteria = function() {
            $scope.form = {
                kind: {
                    Bug: true
                },
                q: '',
                facets: {},
                assignTo: currentUser.username
            };
        };

        // get search metrics data from first item in result set
        $scope.searchMetrics = currentUserBugs.data[0].metrics;
        $scope.totalItems = currentUserBugs.data[0].total;

        // get facets
        $scope.facets = currentUserBugs.data[0].facets;

        // remove search metrics item from the result set
        currentUserBugs.data.splice(0, 1);
        $scope.bugList = currentUserBugs.data;


        bugConfigFactory.getConfig().then(function(response) {

            $scope.config = response.data;
            console.log(response.data);

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




        $scope.search = function() {
            console.log($scope.form);
            return Search.search($scope.form).success(function(response) {
                console.log(response);
                $scope.bugList = response;
                $scope.results = response;
                $scope.facets = response[0].facets;
                $scope.searchMetrics = response[0].metrics;
                $scope.totalItems = response[0].total;
                console.log('facets', $scope.facets);
                console.log('RESULT', response);
                //   Flash.addAlert('success', 'Returned ' + ($scope.results.length - 1) + ' results');
            }).error(function(response) {
                Flash.addAlert('danger', response.status + ' :error occured');
            });
        };

        $scope.clear = function() {
            console.log('clear fields');
            $scope.q = '';
            $scope.form = {};
            $scope.search();
            // $scope.searchForm.$setPristine();
        };


        // filter results based on facets
        $scope.filter = function(facetKind, facet) {
            console.log('$scope.form', $scope.form);
            $scope.form.facets[facetKind] = facet;

            return Search.search($scope.form).success(function(response) {
                console.log(response);
                $scope.results = response;
                $scope.bugList = response;
                $scope.facets = response[0].facets;
                $scope.searchMetrics = response[0].metrics;
                $scope.totalItems = response[0].total;
                angular.element("ul[name='" + facetKind + "']").hide();
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
                $scope.bugList = response;
                $scope.facets = response[0].facets;
                $scope.searchMetrics = response[0].metrics;
                $scope.totalItems = response[0].total;
                angular.element("ul[name='" + facetKind + "']").show();
                Flash.addAlert('success', 'Returned ' + ($scope.results.length - 1) + ' results');
            }).error(function(response) {
                Flash.addAlert('danger', response.status + ' :error occured');
            });
        };

        $scope.hideFacetBox = function() {
            console.log('hide facet');
            angular.element("div[id='facetBox']").hide();
            angular.element('span#showFacetBox').attr('style', 'display:block');
        };

        $scope.showFacetBox = function() {
            console.log('show facet');
            angular.element("div[id='facetBox']").show();
            angular.element('a#showFacetBox').attr('style', 'display:none');
        };



        $scope.goToBug = function(uri) {
            $location.path(uri);
        };

        $scope.setPage = function(pageNo) {
            $scope.currentPage = pageNo;
            console.log('Page changed to: ' + $scope.currentPage);
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;
            getBugDetails(begin, end);
        };


        getBugDetails();


        $scope.$watchCollection('bugList', function() {
            console.log('hey, bug list has changed!', $scope.bugList);
            getBugDetails();
        }, true);


        // private functions
        function getBugDetails(begin, end) {
            $scope.bugs = [];
            var paginatedBugList = $scope.bugList.slice(begin, end);

            angular.forEach(paginatedBugList, function(bug) {
                $scope.bugs.push(bug.content);
            });
        }

        // for pagination, get bug details only for given page
        function getBugList() {
            getBugDetails(0, $scope.itemsPerPage);
        }



    }
]);