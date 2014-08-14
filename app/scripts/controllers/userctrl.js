'user strict';

var app = angular.module('user.controllers', []);

/*app.controller('userCtrl', ['$scope', '$http', '$location', 'Flash', 'User',
    function($scope, $http, $location, Flash, User) {
        $http.get($location.path()).then(function(response) {
            $scope.username = response.data.username;
            // /v1/documents?uri=/user/' + $scope.username + '.json'
            User.getInfo().then(function(response) {
                $scope.user = response.data;
            }, function() {
                // $location.path('/login');
                Flash.addAlert('danger', 'Could not get user profile');
                // Flash.addAlert('warning', 'sign in to go to user profile');
            });
        }, function(response) {
            $location.path('/login');
            Flash.addAlert('warning', response.data.message);
        });

    }
]);
*/

/*app.controller('userCtrl', ['$scope', '$location', 'RESTURL', 'BugService', 'bugFactory', 'Flash', 'getCurrentUserBugs', '$filter', 'getCurrentUser',

    function($scope, $location, RESTURL, BugService, bugFactory, Flash, getCurrentUserBugs, $filter, getCurrentUser) {

        $scope.bugs = [];
        $scope.currentUser = getCurrentUser;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;

        $scope.bugList = getCurrentUserBugs.data.results;
        $scope.totalItems = $scope.bugList.length;
        $scope.bugList.sort(function(a, b) {
            //  console.log(a.uri);
            a = parseInt(a.uri.replace('.json', ''));
            b = parseInt(b.uri.replace('.json', ''));
            return (a - b);
        });

        function getBugDetails(begin, end) {
            $scope.bugs = [];
            angular.forEach($scope.bugList.slice(begin, end), function(bug, index) {
                BugService.getBug(bug.uri).then(function(response) {
                    $scope.bugs.push(response.data);
                    // sort 
                    $scope.bugs.sort(function(a, b) {
                        return (a.id - b.id);
                    });

                }, function() {
                    Flash.addAlert('danger', 'Oops! could not retriev bugs');
                });
            });
        }

        getBugDetails(0, $scope.itemsPerPage);


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
        
        var orderBy = $filter('orderBy');
        $scope.order = function(predicate, reverse) {
            $scope.bugs = orderBy($scope.bugs, predicate, reverse);
        };


    }
]);
*/


app.controller('userRedirectCtrl', ['$location', 'getCurrentUser', function($location, getCurrentUser){
		$location.path('/user/'+ getCurrentUser.username);
}]);