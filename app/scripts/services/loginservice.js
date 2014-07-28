'use strict';

var app = angular.module('user.services', []);
app.constant('RESTURL', 'http://' + location.hostname + ':' + location.port);

app.service('User', ['$http', 'RESTURL',

    function($http, RESTURL) {

        this.create = function(username, payload) {
            var uri = '/user/' + username + '.json';
            return $http({
                method: 'PUT',
                url: RESTURL + '/v1/documents?uri=' + uri + '&collection=users',
                data: payload
            });
        };

        this.isExist = function(user) {
            //  var uri = '/user/' + username + '.json';
            $http({
                method: 'GET',
                url: RESTURL + '/v1/search?q="' + user.username + '"' + '&collection=users'
            });
        };

    }
]);