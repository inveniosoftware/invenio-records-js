/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use strict';

describe('testing directive invenio-records-error', function() {

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

  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_,
    _$timeout_) {
    // Template compiler
    $compile = _$compile_;
    // The Scope
    $rootScope = _$rootScope_;
    // The http backend
    $httpBackend = _$httpBackend_;
    // The timeout
    $timeout = _$timeout_;
    // Expected requests responses
    // Record Schema
    var schema = readJSON('test/fixtures/records.json');
    // Form Schema
    var form = readJSON('test/fixtures/form.json');

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
              '<invenio-records-alert ' +
              'template="src/invenio-records-js/templates/alert.html"> '+
              '</invenio-records-alert>'+
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

  }));

  it('should display the error', function() {
    var message = {
      type: 'danger',
      data:{
        message: 'Harley Quinn looking for Jessica Jones'
      }
    };
    scope.$broadcast('invenio.records.alert', message);

    // Flush timeout
    $timeout.flush();
    expect(scope.recordsVM.invenioRecordsAlert.data)
      .to.deep.equal(message.data);

    scope.$digest();

    expect(template.find('.alert').text()).to.contain(message.data.message);
  });
});
