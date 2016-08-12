/*
 * This file is part of Invenio.
 * Copyright (C) 2016 CERN.
 *
 * Invenio is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * Invenio is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Invenio; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 *
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
 */

'use strict';

describe('Unit: testing controllers', function() {

  var $controller;
  var $rootScope;
  var $location;
  var ctrl;
  var InvenioRecordsAPI;
  var scope;

  // Inject the angular module
  beforeEach(angular.mock.module('invenioRecords'));

  beforeEach(inject(function(_$controller_, _$rootScope_,
      _$location_, _InvenioRecordsAPI_) {
    // Controller
    $controller = _$controller_;
    // The Scope
    $rootScope = _$rootScope_;
    // The location
    $location = _$location_;
    // Set the scope
    scope = $rootScope;
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
    expect(ctrl.invenioRecordsEndpoints.self).to.not.be.undefined;
    expect(ctrl.invenioRecordsEndpoints.publish).to.not.be.undefined;
    expect(ctrl.invenioRecordsEndpoints.files).to.not.be.undefined;
    expect(ctrl.invenioRecordsEndpoints.discard).to.not.be.undefined;
    // The delete is been added afterwards as an action and has the
    // some url as ``.self``
    expect(ctrl.invenioRecordsEndpoints.delete).to.not.be.undefined;
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
});
