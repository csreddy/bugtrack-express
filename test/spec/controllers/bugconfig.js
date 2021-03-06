'use strict';

describe('Controller: BugconfigCtrl', function() {
    console.log('Log message');
    // load the controller's module
    beforeEach(module('bugtrackApp'));

    var BugconfigCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        BugconfigCtrl = $controller('bugConfigCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function() {
        expect(scope.awesomeThings.length).toBe(3);
    });
});