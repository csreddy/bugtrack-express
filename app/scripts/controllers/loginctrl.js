'user strict';

var app = angular.module('login.controllers', ['ngCookies']);

app.controller('loginCtrl', ['$scope', '$location', '$cookieStore', 'Flash', '$http', 'User',
    function($scope, $location, $cookieStore, Flash, $http, User) {


        $scope.login = function() {
            console.log('login called');
            console.log($scope.username, $scope.password);
            var payload = {
                username: $scope.username,
                password: $scope.password
            };
            
            User.login(payload).then(function(response) {
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


app.controller('logoutCtrl', ['$http', 'Flash', '$location', '$rootScope', 
    function($http, Flash, $location, $rootScope) {
        $http.get('/logout').then(function() {
            console.log('logged out');
           // $location.path('/login');
            Flash.addAlert('success', 'user logged out'); 
            $rootScope.navbarUser = undefined;
        }, function() {
            Flash.addAlert('danger', 'something went wrong');
        });
    }
]);

app.controller('registerCtrl', ['$scope', 'Flash', 'User', 'bugConfigFactory',
    function($scope, Flash, User, bugConfigFactory) {

        $scope.config = {};
        bugConfigFactory.getConfig().then(function(response) {
            $scope.config = response.data;
        });


        $scope.createUser = function() {

            // TODO : check if user already exists 

            console.log($scope.user.password1);
            if ($scope.user.password1 !== $scope.user.password2) {
                Flash.addAlert('danger', 'passwords did not match');
            } else {
                var user = {};
                user.name = $scope.user.name;
                user.email = $scope.user.email;
                user.username = $scope.user.username;
                user.password = $scope.user.password1; //md5($scope.user.password1);
                user.createdAt = new Date();
                user.modifiedAt = new Date();
                User.create(user.username, user).then(function() {
                    // update config
                    $scope.config.users.push({
                        'email': user.email,
                        'name': user.name,
                        'username': user.username
                    });
                    bugConfigFactory.updateConfiguration($scope.config);

                    console.log('user', user.fullname);
                    Flash.addAlert('success', '<b>' + user.username + '</b> was successfully created');

                }),
                function(response) {
                    Flash.addAlert('danger', response.data.error.message);
                };
            }

        };

    }
]);


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
]);*/
