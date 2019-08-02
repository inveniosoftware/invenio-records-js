/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

'use strict';

describe('testing directive invenio-records', function() {

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
    // Attach it
    scope = $rootScope;

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
  }));

  it('should trigger init event', function() {
    // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');

    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'extra-params="{}" ' +
              'record=\'{}\' ' +
              'form="/static/json/form.json" ' +
              'initialization="/api/deposit/init" ' +
              'schema="/static/json/records.json"> ' +
            '></invenio-records>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

    // Check if the event has been triggered
    expect(spy.calledWith('invenio.records.init')).to.be.true;
  });

  it('should update the parameters', function() {
    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'extra-params="{}" ' +
              'record=\'{"title_statement": {"title": "Jessica Jones Vol. 1"}}\' ' +
              'form="/static/json/form.json" ' +
              'schema="/static/json/records.json" ' +
            '></invenio-records>';

    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

    // The record model should have the title
    expect(scope.recordsVM.invenioRecordsModel.title_statement.title)
      .to.be.equal('Jessica Jones Vol. 1');

    // The endpoints should be updated
    var endpoints = {
      action: null,
      form: '/static/json/form.json',
      initialization: null,
      schema: '/static/json/schema.json',
    };

    expect(scope.recordsVM.invenioRecordsEndpoints.form)
      .to.deep.equal(endpoints.form);
  });

  it('should have action url', function() {
    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'action="gotham city://batman" ' +
              'extra-params=\'{"params":{"suicide squad": "Harley Quinn"}}\' ' +
              'form="/static/json/form.json" ' +
              'schema="/static/json/records.json" ' +
            '></invenio-records>';

    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

    // The args should be the following
    var args = {
      url: '/',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        'suicide squad': 'Harley Quinn'
      }
    };

    expect(scope.recordsVM.invenioRecordsArgs.params)
      .to.deep.equal(args.params);
  });

  it('should request action before saving action', function() {
    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'initialization="/api/deposit" ' +
              'extra-params=\'{"params":{"suicide squad": "Harley Quinn"}}\' ' +
              'form="/static/json/form.json" ' +
              'schema="/static/json/records.json" ' +
            '></invenio-records>';

    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();
  });

  it('should have the links from the directive', function() {
    // Spy the broadcast
    var spy = sinon.spy($rootScope, '$broadcast');

    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'extra-params="{}" ' +
              'record=\'{}\' ' +
              'form="/static/json/form.json" ' +
              'links=\'{"self": "/jessica jones"}\'' +
              'schema="/static/json/records.json"> ' +
            '></invenio-records>';
    // Compile
    template = $compile(template)(scope);
    // Digest
    scope.$digest();

    // Check if the event has been triggered
    expect(spy.calledWith('invenio.records.init')).to.be.true;
    $httpBackend.flush();
    scope.$digest();
    expect(spy.calledWith('invenio.records.endpoints.updated')).to.be.true;
  });
});
