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

describe('Unit: testing directive invenio-records-actions', function() {

  var $compile;
  var $httpBackend;
  var $rootScope;
  var $timeout;
  var scope;
  var template;

  // Inject the angular module
  beforeEach(angular.mock.module('invenioRecords'));

  // Load the templates
  beforeEach(angular.mock.module('templates'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _$httpBackend_) {
    // Template compiler
    $compile = _$compile_;
    // The Scope
    $rootScope = _$rootScope_;
    // The http backend
    $httpBackend = _$httpBackend_;
    // The timeout service
    $timeout = _$timeout_;

   // Expected requests responses
    // Record Schema
    var schema = readJSON('test/fixtures/records.json');
    // Form Schema
    var form = readJSON('test/fixtures/form.json');
    // Initialization
    var init = readJSON('test/fixtures/init.json');

    $httpBackend.whenGET('/example/static/json/form.json').respond(200, form);
    $httpBackend.whenGET('/example/templates/default.html').respond(200, '');
    $httpBackend.whenGET('/example/static/json/schema.json').respond(200, schema);
    $httpBackend.whenPOST('metropolitan://superman/init').respond(200, init);
    $httpBackend.whenPOST('/api/deposit/init').respond(200, init);
    $httpBackend.whenPOST('http://localhost:5000/api/deposit/depositions/45779/actions/publish').respond(200, {});
    $httpBackend.whenDELETE('gotham city://batman/sucess').respond(200, {});
    $httpBackend.whenPOST('gotham city://batman/sucess').respond(200, init);
    $httpBackend.whenPOST('gotham city://batman/error').respond(400, {
      status: 400,
      message: 'Bruce Wayne is with Wonder Woman and Superman right now!',
      errors: ['error']
    });
    $httpBackend.whenDELETE('gotham city://batman/error').respond(500, {
      message: 'Bruce Wayne is with Wonder Woman and Superman right now!'
    });

    // Attach it
    scope = $rootScope;

  }));

  it('should have the action buttons', function() {
    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'action="gotham city://batman/sucess" ' +
              'form="/example/static/json/form.json" ' +
              'schema="/example/static/json/schema.json"> ' +
              '<invenio-records-actions ' +
              'template="src/invenio-records-js/templates/actions.html"> '+
              '</invenio-records-actions>'+
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);

    // Digest
    scope.$digest();
    // The rendered buttons should be ``2``
    expect(template.find('.btn').length).to.be.equal(5);
  });

  it('should trigger action event for save', function() {
    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'form="/example/static/json/form.json" ' +
              'initialization="/api/deposit/init" ' +
              'schema="/example/static/json/schema.json"> ' +
              '<invenio-records-actions ' +
              'template="src/invenio-records-js/templates/actions.html"> '+
              '</invenio-records-actions>'+
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

     // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');

    // Flash responses to trigger the events
    $httpBackend.flush();
    // Trigger an event
    template.find('.btn').eq(0).triggerHandler('click');

    // Should trigger an event
    spy.should.have.been.called.twice;

    // Flash responses to trigger the events
    $httpBackend.flush();
    // Expect no errors
    expect(scope.recordsVM.invenioRecordsAlert).to.be.equal(null);
  });

  it('should trigger action event for delete', function() {
    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'initialization="gotham city://batman/sucess" ' +
              'form="/example/static/json/form.json" ' +
              'record=\'{"a": "", "b": "c"}\' ' +
              'schema="/example/static/json/schema.json"> ' +
              '<invenio-records-actions ' +
              'template="src/invenio-records-js/templates/actions.html"> '+
              '</invenio-records-actions>'+
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

     // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast')

    // Flash responses to trigger the events
    $httpBackend.flush();
    // Trigger an event
    template.find('.btn').eq(1).triggerHandler('click');

    // Should trigger an event
    spy.should.have.been.called.twice;

    // Flash responses to trigger the events
    $httpBackend.flush();
    $timeout.flush();
    // Expect no errors
    expect(scope.recordsVM.invenioRecordsAlert).to.be.equal(null);
  });

  it('should trigger error for delete', function() {
    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'initialization="gotham city://batman/error" ' +
              'form="/example/static/json/form.json" ' +
              'schema="/example/static/json/schema.json"> ' +
              '<invenio-records-actions ' +
              'template="src/invenio-records-js/templates/actions.html"> '+
              '</invenio-records-actions>'+
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

    // Flash responses to trigger the events
    $httpBackend.flush();

    // Trigger an event
    template.find('.btn').eq(1).triggerHandler('click');
    // Flash responses to trigger the events
    $httpBackend.flush();
    // Expect error
    var error = 'Bruce Wayne is with Wonder Woman and Superman right now!';

    // Expect the message to be
    expect(scope.recordsVM.invenioRecordsAlert.data.message).to.be.equal(error);
  });

  it('should trigger error for save', function() {
    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'initialization="gotham city://batman/error" ' +
              'form="/example/static/json/form.json" ' +
              'schema="/example/static/json/schema.json"> ' +
              '<invenio-records-actions ' +
              'template="src/invenio-records-js/templates/actions.html"> '+
              '</invenio-records-actions>'+
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

    // Flash responses to trigger the events
    $httpBackend.flush();

    // Trigger an event
    template.find('.btn').eq(0).triggerHandler('click');
    // Flash responses to trigger the events
    $httpBackend.flush();
    // Expect error
    var error = 'Bruce Wayne is with Wonder Woman and Superman right now!';

    // Expect the message to be
    expect(scope.recordsVM.invenioRecordsAlert.data.message).to.be.equal(error);
  });

  it('should trigger action with create', function() {
    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'initialization="metropolitan://superman/init" ' +
              'form="/example/static/json/form.json" ' +
              'schema="/example/static/json/schema.json"> ' +
              '<invenio-records-actions ' +
              'template="src/invenio-records-js/templates/actions.html"> '+
              '</invenio-records-actions>'+
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

     // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');

    // Flash responses to trigger the events
    $httpBackend.flush();

    // Trigger an event
    template.find('.btn').eq(0).triggerHandler('click');

    // Should trigger an event
    spy.should.have.been.called.twice;
  });
});
