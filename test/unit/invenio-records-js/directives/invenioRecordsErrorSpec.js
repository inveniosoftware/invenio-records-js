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

describe('Unit: testing directive invenio-records-error', function() {

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
    var schema = {
      question: 'Do you bleed?',
      answer: 'You will!'
    };
    var form = {
      jarvis: 'Where is Jessica Jones and Luke?',
      answer: 'They are with the Punisher'
    };

    $httpBackend.whenGET('/example/static/json/form.json').respond(200, form);
    $httpBackend.whenGET('/example/static/json/schema.json').respond(200, schema);

    // Attach it
    scope = $rootScope;
    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'extra-params="{}" ' +
              'record=\'{}\' ' +
              'initialization="http://locahost:5000/" ' +
              'form="/example/static/json/form.json" ' +
              'schema="/example/static/json/schema.json">' +
              '<invenio-records-error ' +
              'template="src/invenio-records-js/templates/error.html"> '+
              '</invenio-records-error>'+
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

  }));

  it('should display the error', function() {
    var message = {
      message: 'Harley Quinn looking for Jessica Jones'
    };
    scope.$broadcast('invenio.records.error', message);
    expect(scope.vm.invenioRecordsError)
      .to.deep.equal(message);
  });
});
