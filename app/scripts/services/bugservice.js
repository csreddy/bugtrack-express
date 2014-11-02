'use strict';

var app = angular.module('bug.services', []);

app.service('BugService', function($http, RESTURL) {
    // AngularJS will instantiate a singleton by calling 'new' on this function
    this.getBugs = function(criteria) {
        return $http({
            method: 'POST',
            url: '/search',
            data: criteria
        });
    };


    this.getCurrentUserBugs = function(user) {
        return $http({
            method: 'GET',
            url: RESTURL + '/v1/search?format=json&collection=' + user.username + '&pageLength=50'
                //  url: RESTURL + '/v1/search?format=json&collection=bugs&pageLength=50'
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

    this.createNewBug = function(bug, files) {
        return $http({
            url: '/new',
            method: 'POST',
            headers: {
                'Content-Type': undefined
            },
            transformRequest: function(data) {
                var form = new FormData();
                form.append('bug', angular.toJson(bug));
                for (var i = 0; i < data.files.length; i++) {
                    console.log('FORM', data.files[i]);
                    form.append('file' + i, data.files[i]);
                }
                return form;
            },
            data: {
                bug: bug,
                files: files
            }
        });
    };


    this.updateBug = function(bug, files) {
        return $http({
            url: '/new',
            method: 'POST',
            headers: {
                'Content-Type': undefined
            },
            transformRequest: function(data) {
                var form = new FormData();
                form.append('bug', angular.toJson(bug));
                for (var i = 0; i < data.files.length; i++) {
                    console.log('FORM', data.files[i]);
                    form.append('file' + i, data.files[i]);
                }
                return form;
            },
            data: {
                bug: bug,
                files: files
            }
        });
    };

    this.cloneBug = function(payload) {
        console.log('inside updateBug()');
        var payloadForUpdate = {};
        payloadForUpdate.bug = payload;
        return $http({
            method: 'POST',
            url: '/new',
            data: payloadForUpdate
        });
    };


    this.getBug = function(id) {
        return $http({
            method: 'GET',
            url: '/bug/' + id
        });
    };

    this.getBugById = function(id) {
        return $http({
            method: 'GET',
            url: '/bug/' + id
        });
    };

    this.getCount = function() {
        return $http({
            method: 'GET',
            url: '/bug/count'
        });
    };

    this.getFacets = function() {
        return $http({
            method: 'GET',
            url: '/bug/facets'
        });
    };


});
