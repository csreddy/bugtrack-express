'use strict';

var app = angular.module('bugConfig.controllers', []);
app.controller('bugConfigCtrl', ['$scope', 'bugConfigFactory',
    function($scope, bugConfigFactory) {
        $scope.config = {};
        bugConfigFactory.getConfig().then(function(response) {
            $scope.config = response.data;
        });

        $scope.test = 'in config page';

        //  bugConfigFactory.insertConfig(config);


        $scope.addUser = function(email, name, username) {
            var newuser = {
                email: email,
                name: name,
                username: username
            };
            $scope.config.users.push(newuser);
            bugConfigFactory.updateConfiguration($scope.config);
            $scope.newuseremail = $scope.newusername = $scope.newuserusername = '';

        };


        $scope.deleteUser = function(usersIndex) {
            console.log('users', usersIndex);
            for (var i = 0; i < usersIndex.length; i++) {
                $scope.config.users.splice(usersIndex[i], 1);
            }
            bugConfigFactory.updateConfiguration($scope.config);
        };

        // $scope.deleteUser = function(users) {
        //     console.log('users', users);
        //     for (var i = 0; i < users.length; i++) {
        //         while ($scope.config.users.indexOf(users[i]) !== -1) {
        //             $scope.config.users.splice($scope.config.users.indexOf(users[i]), 1);
        //         }
        //     }
        //     bugConfigFactory.updateConfiguration($scope.config);
        // };



    }
]);