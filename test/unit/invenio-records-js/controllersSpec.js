/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use strict';

describe('Unit: testing controllers', function() {

  var $controller;
  var $rootScope;
  var $timeout;
  var $location;
  var ctrl;
  var InvenioRecordsAPI;
  var scope;

  // Inject the angular module
  beforeEach(angular.mock.module('invenioRecords'));

  beforeEach(inject(function(_$controller_, _$rootScope_,
      _$location_, _InvenioRecordsAPI_, _$timeout_) {
    // Controller
    $controller = _$controller_;
    // The Scope
    $rootScope = _$rootScope_;
    // The location
    $location = _$location_;
    // Set the scope
    scope = $rootScope;
    // Set the timout
    $timeout = _$timeout_;
    // Set the service
    InvenioRecordsAPI = _InvenioRecordsAPI_;
    // The controller
    ctrl = $controller('InvenioRecordsCtrl', {
      $scope: scope,
    });
  }));

  it('should have the default parameters', function() {
    // Expect loading to be ``true``
    expect(ctrl.invenioRecordsLoading).to.be.true;
    // Expect error to be ``null``
    expect(ctrl.invenioRecordsAlert).to.be.null;

    // Expect model to be ``{}``
    expect(ctrl.invenioRecordsModel).to.be.null;
    // Expect endpoints to be ``{}``
    expect(ctrl.invenioRecordsEndpoints).to.be.null;

    // Expect the request args
    var args = {
      url: '/',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    expect(ctrl.invenioRecordsArgs).to.deep.equal(args);
  });

  it('should return undefined on empty url', function() {
    var api = InvenioRecordsAPI.get(null);
    expect(api.$$state.value).to.be.undefined;
  });

  it('should trigger the events', function() {

    // Trigger error event
    scope.$broadcast('invenio.records.alert', {
      type: 'success',
      data: {
        message: 'Bruce Wayne is not Superman Clark Kent is, dah!'
      }
    });

    $timeout.flush();

    expect(ctrl.invenioRecordsAlert.data.message).to.be.equal(
      'Bruce Wayne is not Superman Clark Kent is, dah!'
    );

    // Trigger loading start event
    scope.$broadcast('invenio.records.loading.start');

    // Expect loading to be ``false``
    expect(ctrl.invenioRecordsLoading).to.be.true;

    // Trigger loading start event
    scope.$broadcast('invenio.records.loading.stop');

    // Expect loading to be ``false``
    expect(ctrl.invenioRecordsLoading).to.be.false;
  });

  it('should receive update endpoints event', function() {

    var response = {
      self: '/self',
      edit: '/edit',
      files: '/files',
      publish: '/publish',
      discard: '/discard'
    };
    // Trigger error event
    scope.$broadcast('invenio.records.endpoints.updated', response);

    // Expect the endpoints to be updated
    expect(ctrl.invenioRecordsEndpoints.discard).to.not.be.undefined;
    expect(ctrl.invenioRecordsEndpoints.edit).to.not.be.undefined;
    expect(ctrl.invenioRecordsEndpoints.files).to.not.be.undefined;
    expect(ctrl.invenioRecordsEndpoints.publish).to.not.be.undefined;
    expect(ctrl.invenioRecordsEndpoints.self).to.not.be.undefined;
  });

  it('should update the location on event', function() {
    // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');
    // Triger the event
    scope.$broadcast('invenio.records.location.updated', {
      html: '/deposit/harley_quinn'
    });
    // Check if the event has been triggered
    expect(spy.calledWith('invenio.records.location.updated')).to.be.true;
    // Location should be
    expect($location.url()).to.be.equal('/deposit/harley_quinn');
  });

  it('should not update the location on event', function() {
    // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');
    // Triger the event
    scope.$broadcast('invenio.records.location.updated', {
      self: '/deposit/harley_quinn'
    });
    // Check if the event has been triggered
    expect(spy.calledWith('invenio.records.location.updated')).to.be.true;
    // Location should be
    expect($location.url()).to.be.equal('/');
  });

  it('should return the data clean', function() {
    var dirty = {
      first: [null],
      second: [{}],
      third: '',
      forth: [undefined],
      newyork: 'Jessica Jones',
      metropolis: 'Harley Quinn'
    };
    var clean = InvenioRecordsAPI.cleanData(dirty);
    expect(clean).to.deep.equal({
      newyork: 'Jessica Jones',
      metropolis: 'Harley Quinn'
    });
  });
});
