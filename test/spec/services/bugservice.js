'use strict';

describe('Service: Bugservice', function () {

  // load the service's module
  beforeEach(module('bugtrackApp'));

  // instantiate service
  var Bugservice;
  beforeEach(inject(function (_Bugservice_) {
    Bugservice = _Bugservice_;
  }));

  it('should do something', function () {
    expect(!!Bugservice).toBe(true);
  });

});
