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

describe('testing directive invenio-records-actions', function() {

  var $compile;
  var $controller;
  var $httpBackend;
  var $rootScope;
  var ctrl;
  var scope;
  var template;

  // Inject the angular modules
  beforeEach(angular.mock.module('invenioRecords', 'templates', 'schemaForm',
    'ngSanitize', 'mgcrea.ngStrap', 'mgcrea.ngStrap.modal',
    'pascalprecht.translate', 'ui.select', 'mgcrea.ngStrap.select'));

  beforeEach(inject(function(
      _$controller_, _$compile_, _$rootScope_, _$httpBackend_
    ) {
    // Template compiler
    $compile = _$compile_;
    // Controller
    $controller = _$controller_;
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

    $httpBackend.whenGET('/example/static/json/form.json').respond(200, form);
    $httpBackend.whenGET('/example/templates/default.html').respond(200, '');
    $httpBackend.whenGET('/example/static/json/schema.json').respond(200, schema);
    $httpBackend.whenPOST('metropolitan://superman/init').respond(200, init);
    $httpBackend.whenPOST('/api/deposit/init').respond(200, init);
    $httpBackend.whenPOST('/api/deposit/depositions/45779/actions/publish').respond(200, {});
    $httpBackend.whenPUT('/api/deposit/depositions/45779').respond(200, {});
    $httpBackend.whenDELETE('gotham city://batman/sucess').respond(200, {});
    $httpBackend.whenPOST('gotham city://batman/sucess').respond(200, init);
    $httpBackend.whenGET('/static/node_modules/invenio-records-js/dist/templates/default.html').respond(200, '');
    $httpBackend.whenGET('/static/node_modules/invenio-records-js/dist/templates/select.html').respond(200, '');

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

    scope.$apply();
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
     // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');

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

    // Flash responses to trigger the events
    $httpBackend.flush();

    // Trigger an event
    template.find('.btn').eq(0).triggerHandler('click');

    // Digest
    scope.$digest();

    // Should trigger an event
    spy.should.have.been.called.twice;

    // Expect no errors
    expect(scope.recordsVM.invenioRecordsAlert).to.be.equal(null);

    // Digest
    scope.$digest();
  });

  it('should trigger action events for states', function() {
    // Complile&Digest here to catch the event
     // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');

    // The directive's template
    template = '<invenio-records ' +
              'initialization="gotham city://batman/sucess" ' +
              'form="/example/static/json/form.json" ' +
              'record=\'{"a": "", "b": "c"}\' ' +
              'schema="/example/static/json/schema.json"> ' +
              '<form name="depositionForm" sf-schema="scope.recordsVM.invenioRecordsSchema" ' +
              'sf-form=\'["*"]\' sf-model="scope.recordsVM.invenioRecordsModel"></form>' +
              '<invenio-records-actions ' +
              'template="src/invenio-records-js/templates/actions.html"> '+
              '</invenio-records-actions>'+
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

    scope.$apply();

    // Flash responses to trigger the events
    $httpBackend.flush();

    // Trigger an event
    template.find('.btn').eq(0).triggerHandler('click');

    // Flash responses to trigger the events
    $httpBackend.flush();

    //Should trigger init
    expect(spy.calledWith('invenio.records.init')).to.be.true;
    //Should trigger action
    expect(spy.calledWith('invenio.records.action')).to.be.true;
    //Should trigger endpoints updated
    expect(spy.calledWith('invenio.records.endpoints.updated')).to.be.true;
    // Should trigger action success
    expect(spy.calledWith('invenio.records.action.success')).to.be.true;

    // Trigger an event
    template.find('.btn').eq(1).triggerHandler('click');

    // Flash responses to trigger the events
    $httpBackend.flush();

    // Trigger an event
    template.find('.btn').eq(0).triggerHandler('click');

    // Flash responses to trigger the events
    $httpBackend.flush();

    scope.recordsVM.actionHandler('The Punisher Action');

    // Digest
    scope.$digest();

    // Expect error
    var error = 'The action type is not supported.';

    // Expect the message to be
    expect(scope.recordsVM.invenioRecordsAlert.data.message).to.be.equal(error);

    // Check the validation
    scope.recordsVM.removeValidationMessage(
      angular.noop, {
        validationMessage: true,
        key: ['0', 'title']
      }
    );

    // Digest
    scope.$digest();

    // Should trigger action success
    expect(spy.calledWith('schemaForm.error.0.title')).to.be.true;

    // Check the validation
    scope.recordsVM.removeValidationMessage(
      angular.noop, {
        validationMessage: false,
        key: ['hello']
      }
    );

    // Digest
    scope.$digest();

    // Should trigger action success
    expect(spy.calledWith('schemaForm.error.hello')).to.be.false;
  });

  it('should trigger action event for delete', function() {
     // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');

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

    // Flash responses to trigger the events
    $httpBackend.flush();

    // Trigger an event
    template.find('.btn').eq(1).triggerHandler('click');

    // Should trigger an event
    spy.should.have.been.called.twice;

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
    // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');

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


    // Flash responses to trigger the events
    $httpBackend.flush();

    // Trigger an event
    template.find('.btn').eq(0).triggerHandler('click');

    // Should trigger an event
    spy.should.have.been.called.twice;
  });
});
