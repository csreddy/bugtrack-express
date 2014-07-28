'user strict';

var app = angular.module('login.controllers', ['ngCookies']);

app.controller('loginCtrl', ['$scope', '$location', '$cookieStore', 'Flash', '$window', '$http',
    function($scope, $location, $cookieStore, Flash, $window, $http) {

        $scope.login = function() {
            console.log('login called');
            console.log($scope.username, $scope.password);
            var payload = {
                username: $scope.username,
                password: $scope.password
            };
            $http({
                method: 'POST',
                url: '/login',
                data: payload
            }).then(function(response) {
                    console.log(response);
                    $location.path('/user/' + response.data.username);
                    Flash.addAlert('success', 'Welcome! ' + response.data.username);
                },
                function(response) {
                    Flash.addAlert('danger', response.data.message);
                });
        };

    }
]);


app.controller('logoutCtrl', ['$http', 'Flash',
    function($http, Flash) {
        $http.get('/logout').then(function(response) {
            console.log('logged out');
            Flash.addAlert('success', 'user logged out');
        }, function() {
            Flash.addAlert('danger', 'something went wrong');
        });
    }
]);

app.controller('registerCtrl', ['$scope', 'Flash', 'User',
    function($scope, Flash, User) {

        $scope.createUser = function() {

            // TODO : check if user already exists 

            console.log($scope.user.password1);
            if ($scope.user.password1 !== $scope.user.password2) {
                Flash.addAlert('danger', 'passwords did not match');
            } else {
                var user = {};
                user.email = $scope.user.email;
                user.username = $scope.user.username;
                user.password = $scope.user.password1; //md5($scope.user.password1);
                user.createdAt = new Date();
                user.modifiedAt = new Date();
                User.create(user.username, user).then(function() {
                    Flash.addAlert('success', '<b>' + user.username + '</b> was successfully created');
                }),
                function(response) {
                    Flash.addAlert('danger', response.data.error.message);
                };
            }

        };

    }
]);


app.controller('userCtrl', ['$scope', '$http', '$location', 'Flash',
    function($scope, $http, $location, Flash) {
        $http.get('/user').then(function(response) {
            $scope.username = response.data;
            $http.get('/v1/documents?uri=/user/' + $scope.username + '.json').then(function(response) {
                $scope.userdata = response.data;
            }, function(response) {
                Flash.addAlert('danger', 'could not get user profile');
            });
        }, function(response) {
            $location.path('/login');
            Flash.addAlert('warning', response.data.message);
        });

    }
])