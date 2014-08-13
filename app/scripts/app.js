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
    'user.services',
    'user.controllers',
    'dashboard.controllers',
    'search.controllers',
    'search.services',
    'navbar.controllers',
    'modal.services'
    //   'angular-flash.service',
    //  'angular-flash.flash-alert-directive'
]);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/list.html',
            controller: 'bugListCtrl',
            resolve: {
                getCurrentUser: ['User',
                    function(User) {
                        return User.getCurrentUserInfo();
                    }
                ],
                getCurrentUserBugs: ['BugService', 'User',
                    function(BugService, User) {
                        return User.getCurrentUserInfo().then(function(user) {
                            return BugService.getCurrentUserBugs(user);
                        });

                    }
                ]
            }
        })
        .when('/list', {
            templateUrl: 'views/list.html',
            controller: 'bugListCtrl',
            resolve: {
                getCurrentUser: ['User',
                    function(User) {
                        return User.getCurrentUserInfo();
                    }
                ],
                getCurrentUserBugs: ['BugService', 'User',
                    function(BugService, User) {
                        return User.getCurrentUserInfo().then(function(user) {
                            return BugService.getCurrentUserBugs(user);
                        });

                    }
                ]
            }
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .when('/logout', {
            templateUrl: 'views/login.html',
            controller: 'logoutCtrl'
        })
        .when('/user/:username', {
            templateUrl: 'views/user.html',
            controller: 'userCtrl',
            resolve: {
                getCurrentUser: ['User',
                    function(User) {
                        return User.getCurrentUserInfo();
                    }
                ],
                getCurrentUserBugs: ['BugService', 'User',
                    function(BugService, User) {
                        return User.getCurrentUserInfo().then(function(user) {
                            return BugService.getCurrentUserBugs(user);
                        });

                    }
                ]
            }
        })
       .when('/home', {
            templateUrl: 'views/user.html',
            controller: 'userRedirectCtrl',
            resolve:{
                getCurrentUser: ['User',
                    function(User) {
                        return User.getCurrentUserInfo();
                    }
                ]
            }
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
                getCurrentUser: ['User',
                    function(User) {
                        return User.getCurrentUserInfo();
                    }
                ],
                bugId: ['BugService',
                    function(BugService) {
                        return BugService.getCount();
                    }
                ]

            }
        })
        .when('/config', {
            templateUrl: 'views/config.html',
            controller: 'bugConfigCtrl'
        })
        .when('/bug/:id', {
            templateUrl: 'views/bugdetails.html',
            controller: 'bugViewCtrl',
            resolve: {
                getCurrentUser: ['User',
                    function(User) {
                        return User.getCurrentUserInfo();
                    }
                ],
                bugId: ['BugService',
                    function(BugService) {
                        return BugService.getCount();
                    }
                ]
            }
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .when('/404', {
            templateUrl: '404.html'
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