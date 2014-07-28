'use strict';

describe('Service: bugFactory', function () {

  // load the service's module
  beforeEach(module('bugtrackApp'));

  // instantiate service
  var bugFactory;
  beforeEach(inject(function (_bugFactory_) {
    bugFactory = _bugFactory_;
  }));

  it('should do something', function () {
    expect(!!bugFactory).toBe(true);
  });

});
