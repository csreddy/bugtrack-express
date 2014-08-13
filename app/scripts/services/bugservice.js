'use strict';

var app = angular.module('bug.services', []);

app.service('BugService', function($http, RESTURL) {
    // AngularJS will instantiate a singleton by calling 'new' on this function
    this.getBugs = function() {
        // if (q === undefined || q === null) {
        //     q = '';
        // }
        // console.log('q = ' + q);
        return $http({
            method: 'GET',
            url: RESTURL + '/v1/search?format=json&collection=bugs&pageLength=50'
        });
    };


    this.getCurrentUserBugs = function(user) {
        return $http({
            method: 'GET',
            url: RESTURL + '/v1/search?format=json&collection=' + user.username + '&pageLength=50'
        });
    };

    this.putDocument = function(uri, payload, user) {
        console.log('document = ' + uri);
        return $http({
            method: 'PUT',
            url: RESTURL + '/v1/documents?uri=' + uri + '&collection=bugs&collection=' + user.username,
            data: payload
        });
    };

    this.getBug = function(uri) {
        return $http({
            method: 'GET',
            url: RESTURL + '/v1/documents?uri=' + uri
        });
    };

    this.getBugById = function(id) {
        return $http({
            method: 'GET',
            url: RESTURL + '/v1/documents?uri=' + id + '.json'
        });
    };



    this.getCount = function() {
        return $http({
            method: 'GET',
            url: RESTURL + '/v1/search?format=json&view=metadata&collection=bugs'
        });
    };


});