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
    //'login.controllers',
    'user.services',
    'user.controllers',
    'dashboard.controllers',
    'search.controllers',
    'search.services',
    'navbar.controllers',
    'modal.services',
    'fileupload.directive',
    'code.directive'
    //   'angular-flash.service',
    //  'angular-flash.flash-alert-directive'
]);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/list.html',
            controller: 'searchCtrl',
            title: 'Home',
            resolve: {
                currentUser: ['User',
                    function(User) {
                        return User.getCurrentUserInfo();
                    }
                ],
                getAllBugs: ['BugService',
                    function(BugService) {
                        return BugService.getBugs();
                    }
                ],
                config: ['bugConfigFactory',
                    function(bugConfigFactory) {
                        var config = {};
                        return bugConfigFactory.getConfig().then(function(configdata) {
                            config = angular.copy(configdata.data);
                            config.kind = [];
                            config.status = [];
                            config.severity = [];
                            for (var i = 0; i < configdata.data.kind.length; i++) {
                                config.kind.push({
                                    name: configdata.data.kind[i],
                                    value: false
                                });
                            }
                            for (var i = 0; i < configdata.data.status.length; i++) {
                                config.status.push({
                                    name: configdata.data.status[i],
                                    value: false
                                });
                            }
                              for (var i = 0; i < configdata.data.severity.length; i++) {
                                config.severity.push({
                                    name: configdata.data.severity[i],
                                    value: false
                                });
                            }
                            return config;
                        });
                    }
                ]
            }
        })
        .when('/list2', {
            title: 'Home',
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
                ],
                getAllBugs: ['BugService',
                    function(BugService) {
                        return BugService.getBugs();
                    }
                ],
                loadConfig: ['bugConfigFactory',
                    function(bugConfigFactory) {
                        return bugConfigFactory.getConfig();
                    }
                ]
            }
        })
        .when('/login', {
            title: 'Login',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .when('/logout', {
            title: 'Logout',
            templateUrl: 'views/login.html',
            controller: 'logoutCtrl'
        })
        .when('/user/:username', {
            title: 'Home',
            templateUrl: 'views/user.html',
            controller: 'userProfileCtrl',
            resolve: {
                currentUser: ['User',
                    function(User) {
                        return User.getCurrentUserInfo();
                    }
                ],
                currentUserBugs: ['BugService', 'User',
                    function(BugService, User) {
                        return User.getCurrentUserInfo().then(function(user) {
                            return BugService.getCurrentUserBugs(user);
                        });

                    }
                ]
            }
        })
        .when('/home', {
            title: 'Home',
            templateUrl: 'views/user.html',
            controller: 'userRedirectCtrl',
            resolve: {
                getCurrentUser: ['User',
                    function(User) {
                        return User.getCurrentUserInfo();
                    }
                ]
            }
        })
        .when('/register', {
            title: 'Register',
            templateUrl: 'views/register.html',
            controller: 'registerCtrl'
        })
        .when('/new', {
            title: 'New',
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
            title: 'Configure',
            templateUrl: 'views/config.html',
            controller: 'bugConfigCtrl'
        })
        .when('/bug/:id', {
            title: 'Bug Details',
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
            title: 'Dashboard',
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

/*app.run(['$location', '$rootScope', 'editableOptions', function($location, $rootScope, editableOptions) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$route.title;
    });

    // Xeditable
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);*/

app.run(function(editableOptions) {
    // Xeditable
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});