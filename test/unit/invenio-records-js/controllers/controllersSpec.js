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
  var ctrl;
  var scope;

  // Inject the angular module
  beforeEach(angular.mock.module('invenioRecords'));

  beforeEach(inject(function(_$controller_, _$rootScope_) {
    // Controller
    $controller = _$controller_;
    // The Scope
    $rootScope = _$rootScope_;
    // Set the scope
    scope = $rootScope;
    // The controller
    ctrl = $controller('invenioRecordsController', {
      $scope: scope,
    });
  }));

  it('should have the default parameters', function() {
    // Expect loading to be ``true``
    expect(ctrl.invenioRecordsLoading).to.be.equal(true);

    // Expect error to be ``null``
    expect(ctrl.invenioRecordsError).to.be.equal(null);
    // Expect notify to be ``null``
    expect(ctrl.invenioRecordsWarning).to.be.equal(null);

    // Expect model to be ``{}``
    expect(ctrl.invenioRecordsModel).to.be.equal(null);
    // Expect endpoints to be ``{}``
    expect(ctrl.invenioRecordsEndpoints).to.be.equal(null);

    // Expect the request args
    var args = {
      url: '/',
      method: 'GET'
    };
    expect(ctrl.invenioRecordsArgs).to.deep.equal(args);
  });

  it('should trigger the events', function() {

    // Trigger error event
    scope.$broadcast('invenio.records.error', {
      message: 'Bruce Wayne is not Superman Clark Kent is, dah!'
    });

    // Expect error to be the above message
    expect(ctrl.invenioRecordsError.message).to.be.equal(
      'Bruce Wayne is not Superman Clark Kent is, dah!'
    );

    // Trigger warning event
    scope.$broadcast('invenio.records.warn', {
      message: 'Tell me, do you bleed?'
    });

    // Expect warning to be the above message
    expect(ctrl.invenioRecordsWarning.message).to.be.equal(
      'Tell me, do you bleed?'
    );

    // Trigger loading start event
    scope.$broadcast('invenio.records.loading.start');

    // Expect loading to be ``false``
    expect(ctrl.invenioRecordsLoading).to.be.equal(true);

    // Trigger loading start event
    scope.$broadcast('invenio.records.loading.stop');

    // Expect loading to be ``false``
    expect(ctrl.invenioRecordsLoading).to.be.equal(false);
  });
});
