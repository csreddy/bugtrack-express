'use strict';

var app = angular.module('bugtrackApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'bug.controllers',
    'bug.services',
    'bug.factory',
    'bugConfig.services',
    'bugConfig.controllers',
    'bugTexteditor.directive',
    'bugtrackApp.flashService',
    'xeditable',
    'wysiHtml5.directive',
    'login.controllers',
    'user.services'
    //   'angular-flash.service',
    //  'angular-flash.flash-alert-directive'
]);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/list.html',
            controller: 'bugListCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .when('/user/:username', {
            templateUrl: 'views/user.html',
            controller: 'userCtrl'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'registerCtrl'
        })
        .when('/new', {
            templateUrl: 'views/new.html',
            controller: 'newBugCtrl',
            resolve: {
                loadConfig: ['bugConfigFactory',
                    function(bugConfigFactory) {
                        return bugConfigFactory.getConfig();
                    }
                ],
                getCurrentUser: ['User', '$location', 'Flash',
                    function(User, $location, Flash) {
                        User.getInfo().then(function(response) {
                            return response.data;
                        }, function(response) {
                            $location.path('/login');
                            Flash.addAlert('warning', response.data.message);
                        });

                    }
                ]
            }
        })
        .when('/list', {
            templateUrl: 'views/list.html',
            controller: 'bugListCtrl'
        })
        .when('/config', {
            templateUrl: 'views/config.html',
            controller: 'bugConfigCtrl'
        })
        .when('/bug/:id', {
            templateUrl: 'views/bugdetails.html',
            controller: 'bugViewCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.constant('RESTURL', 'http://' + location.hostname + ':' + location.port);

app.run(function(editableOptions) {
    // Xeditable
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});