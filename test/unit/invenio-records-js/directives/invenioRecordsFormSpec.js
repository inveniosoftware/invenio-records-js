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

describe('Unit: testing directive invenio-records-form', function() {

  var $compile;
  var $httpBackend;
  var $rootScope;
  var scope;
  var template;

  // Inject the angular module
  beforeEach(angular.mock.module('invenioRecords'));

  // Load the templates
  beforeEach(angular.mock.module('templates'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
    // Template compiler
    $compile = _$compile_;
    // The Scope
    $rootScope = _$rootScope_;
    // The http backend
    $httpBackend = _$httpBackend_;
   // Expected requests responses

    // Record Schema
    var schema = readJSON('test/fixtures/records.json');
    // Form Schema
    var form = readJSON('test/fixtures/form.json');
    // Initialization
    var init = readJSON('test/fixtures/init.json');


    // When request record schema
    $httpBackend.whenGET('/static/json/records.json').respond(200, schema);

    // When request /form
    $httpBackend.whenGET('/static/json/form.json').respond(200, form);

    // When requesting initialization
    $httpBackend.whenPOST('/api/deposit/init').respond(200, init);

    // Attach it
    scope = $rootScope;

    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'form="/static/json/form.json" ' +
              'initialization="/api/deposit/init" ' +
              'schema="/static/json/records.json"> ' +
              '<invenio-records-form ' +
              'template="src/invenio-records-js/templates/form.html"> '+
              '</invenio-records-form>'+
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);

    // Digest
    scope.$digest();
  }));

  it('should have the action buttons', function() {
    // Should have ``form`` element
    expect(template.find('form').length).to.be.equal(1);
  });
});
