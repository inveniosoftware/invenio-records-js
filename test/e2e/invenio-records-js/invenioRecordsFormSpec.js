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

  // Inject the angular modules
  beforeEach(angular.mock.module('invenioRecords', 'templates', 'schemaForm',
    'ngSanitize', 'mgcrea.ngStrap', 'mgcrea.ngStrap.modal',
    'pascalprecht.translate', 'ui.select', 'mgcrea.ngStrap.select'));

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
    // Autocompletion response
    var autocompleteResponse = {
      a: {
        b:[{
          c:{d:{
              name: 'hello'
            }},
          e:{f:{
              value: 'world'
            }}
        },
        {
        c:{d:{
            name: 'hi'
          }},
        e:{f:{
            value: 'werld'
          }}
        }]
      }
    };


    // When request record schema
    $httpBackend.whenGET('/static/json/records.json').respond(200, schema);

    // When request /form
    $httpBackend.whenGET('/static/json/form.json').respond(200, form);

    // When requesting initialization
    $httpBackend.whenPOST('/api/deposit/init').respond(200, init);

    // When autocompleting
    $httpBackend.whenGET('/autocomplete').respond(200, autocompleteResponse);

    $httpBackend.whenGET('/static/node_modules/invenio-records-js/dist/templates/default.html').respond(200, '');
    $httpBackend.whenGET('/test/template/alert.html').respond(200, '');
    $httpBackend.whenGET('/test/template/loading.html').respond(200, '');
    $httpBackend.whenGET('directives/decorators/bootstrap/fieldset.html').respond(200, '');

    // Attach it
    scope = $rootScope;

    // Complile&Digest here to catch the event
    // The directive's template
    template = '<invenio-records ' +
              'form="/static/json/form.json" ' +
              'initialization="/api/deposit/init" ' +
              'schema="/static/json/records.json"> ' +
              '<invenio-records-form ' +
              'template="src/invenio-records-js/templates/form.html" ' +
              'form-templates-base="/static/node_modules/invenio-records-js/dist/templates" ' +
              'form-templates=\'{"default": "default.html"}\'>' +
              '</invenio-records-form>' +
              '<invenio-records-alert ' +
              'template="/test/template/alert.html">' +
              '</invenio-records-alert>' +
              '<invenio-records-loading ' +
              'template="/test/template/loading.html">' +
              '</invenio-records-loading>' +
            '</invenio-records>';
    // Compile
    template = $compile(template)(scope);

    // Digest
    $httpBackend.flush();
    scope.$apply();
  }));

  it('should have the form element', function() {
    // Should have ``form`` element
    expect(template.find('form').length).to.be.equal(1);
  });

  it('should have three ui select elements', function() {
    // Should have ``form`` element
    expect(template.find('.ui-select-search').length).to.be.equal(3);
    // check that ui-select works
    template.find('.ui-select-search').eq(0).val('Jessica Jones');
    expect(template.find('.ui-select-search').eq(0).val()).to.be.equal('Jessica Jones');
  });

  it('should successfuly handle autocomplete', function() {
    // Success autocomplete
    var autocompleteSuccess = readJSON('test/fixtures/autocomplete.json');

    // Autocomplete reply
    $httpBackend.whenGET('/autocomplete?q=Jessica+Jones&success=true').respond(200, autocompleteSuccess);

    scope.autocompleteSuggest(
      {
        url: '/autocomplete',
        map: {
          resultSource: 'text.0.options',
          valueSource: 'payload.id',
          nameSource: 'text',
          valueProperty: 'value',
          nameProperty: 'name',
        },
        urlParameters: {
          q: 'value',
          success: 'true'
        }
      },
      'Jessica Jones'
    ).then(function(result) {
      var options = autocompleteSuccess.text[0].options;
      expect(result.data[0].value).to.deep.equal(options[0].payload.id);
      expect(result.data[0].name).to.deep.equal(options[0].text);
      expect(result.data[4].value).to.deep.equal(options[4].payload.id);
      expect(result.data[4].name).to.deep.equal(options[4].text);
    });
    // Flash the request
    $httpBackend.flush();
  });

  it('should error handle autocomplete', function() {
    var autocompleteSuccess = readJSON('test/fixtures/autocomplete.json');
    // Autocomplete reply

    $httpBackend.whenGET('/autocomplete?plain=The+Punisher&scope=Harley+Quinn&text=Jessica+Jones').respond(500, {});
    // Add a var to the scope
    scope.query = 'Harley Quinn';

    scope.autocompleteSuggest(
      {
        url: '/autocomplete',
        map: {
          resultSource: 'text.0.options',
          valueSource: 'payload.id',
          nameSource: 'text',
          valueProperty: 'value',
          nameProperty: 'name',
        },
        urlParameters: {
          text: 'value',
          scope: 'query',
          plain: 'The Punisher'
        }
      },
      'Jessica Jones'
    ).then(function(result) {
      expect(result.data).to.deep.equal([]);
    });

    // Flash the request
    scope.$apply();

    scope.autocompleteSuggest(
      {
        map: {
          resultsProperty: 'text.0.options',
        },
        urlParameters: {
          text: 'value',
          scope: 'query',
          plain: 'punisher'
        }
      },
      'Jessica Jones'
    ).then(function(result) {
      expect(result.data).to.deep.equal([]);
    });

    // Flash the request
    scope.$apply();
  });
});
