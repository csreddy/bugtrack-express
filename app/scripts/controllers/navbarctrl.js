'user strict';

var app = angular.module('navbar.controllers', []);

app.controller('navbarCtrl', ['$scope', '$location', 'User',
    function($scope, $location, User) {

        $scope.showOrHide = function() {
          return User.getCurrentUserInfo().then(function() {
                return false;
            }, function() {
               return true;
            });
        };


    }
]);