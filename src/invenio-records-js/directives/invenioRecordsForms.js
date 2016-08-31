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

/**
  * @ngdoc directive
  * @name invenioRecordsForm
  * @description
  *    The invenio records form directive handler
  * @namespace invenioRecordsForm
  * @example
  *    Usage:
  *     <invenio-records-form
  *      form-templates='{"textarea": "textarea.html"}'
  *      form-templates-base="/src/node_modules"
  *      template="">
  *     </invenio-records-form>
  */
function invenioRecordsForm($q, schemaFormDecorators, InvenioRecordsAPI,
  $httpParamSerializerJQLike) {

  // Functions

  /**
    * Initialize directive
    * @memberof invenioRecords
    * @param {service} scope -  The scope of this element.
    * @param {service} element - Element that this directive is assigned to.
    * @param {service} attrs - Attribute of this element.
    * @param {InvenioRecordsCtrl} vm - Invenio records controller.
    */
  function link(scope, element, attrs, vm) {

    // Add custom templates
    if (attrs.formTemplates && attrs.formTemplatesBase) {
      var formTemplates = JSON.parse(attrs.formTemplates);
      var formTemplatesBase = attrs.formTemplatesBase;

      if (formTemplatesBase.substr(formTemplatesBase.length -1) !== '/') {
        formTemplatesBase = formTemplatesBase + '/';
      }

      angular.forEach(formTemplates, function(value, key) {
        schemaFormDecorators
          .decorator()[key.replace('_', '-')]
          .template = formTemplatesBase + value;
      });
    }

    /**
      * Get property from object
      * @memberof invenioRecordsFrom
      * @function getProp
      * @param {Object} obj - The object.
      * @param {String} prop - The property path to retrieve.
      */
    var getProp = function (obj, prop) {
      return prop.split('.').reduce(function(data, item) {
        return data[item];
      }, obj);
    };

    /**
      * Empty promise for the autocompletion
      * @memberof invenioRecordsFrom
      * @function _errorOrEmpty
      */
    function _errorOrEmpty(){
      var defer = $q.defer();
      defer.resolve({data: []});
      return defer.promise;
    }

    /**
      * Handle the autocomplete request
      * @memberof invenioRecordsFrom
      * @function _suggestEngine
      * @param {Object} args - The arguments for the request.
      * @param {Object} map - Results property map.
      */
    function _suggestEngine(args, map) {
      if (args.url !== undefined) {
        return InvenioRecordsAPI.request(args)
          .then(
            function success(response) {
              var data = getProp(response.data, map.resultSource);
              angular.forEach(data, function(value, key) {
                var item = {};
                item[map.valueProperty] = getProp(value, map.valueSource || map.valueProperty);
                item[map.nameProperty] = getProp(value, map.nameSource || map.nameProperty);
                data[key] = item;
              });
              return {
                data: data
              };
            },
            _errorOrEmpty
          );
      }
      return _errorOrEmpty();
    }

    /**
      * Add url parameters
      * @memberof invenioRecordsFrom
      * @function _urlParser
      * @param {String} url - The url.
      * @param {Object} urlParameters - The parameters for the url.
      * @param {String} query - The query.
      */
    function _urlParser(url, urlParameters, query){
      if (urlParameters !== undefined) {
        var urlArgs = {};
        angular.forEach(urlParameters, function(value, key) {
          try {
            if (value === 'value'){
              urlArgs[key] = query;
            } else {
              urlArgs[key] = scope.$eval(value) || value;
            }
          } catch(error) {
            urlArgs[key] = value;
          }
        });
        url = url + '?' + $httpParamSerializerJQLike(
          angular.merge({}, urlArgs)
        );
      }
      return url;
    }

    /**
      * Trigger it on autocomplete field
      * @memberof invenioRecordsFrom
      * @function autocompleteSuggest
      * @param {Object} options - The options from the form schema.
      * @param {String} query - The query.
      */
    function autocompleteSuggest(options, query) {
      var args = {};
      // If the query string is empty and there's already a value set on the
      // model, this means that the form was just loaded and is trying to
      // display this value.
      // This also happens when the user clicks on a suggestion or on the
      // suggestion field. In this case, return the previous suggestions.
      if (query === '') {
        if (scope.lastSuggestions[options.url]) {
          var defer = $q.defer();
          defer.resolve(scope.lastSuggestions[options.url]);
          return defer.promise;
        } else if (options.scope && typeof options.scope.insideModel === 'string') {
          // Pre-process the query value/identifier
          query = options.scope.insideModel;
          query = scope.$eval(options.processQuery || 'query', {query: query});
        }
      }
      if (query && options.url !== undefined) {
        // Parse the url parameters
        args = angular.extend({}, args,
          {
            url: _urlParser(options.url, options.urlParameters, query),
            method: 'GET',
            data: options.data || {},
            headers: options.headers || vm.invenioRecordsArgs.headers
          }
        );
      }
      return _suggestEngine(args, options.map).then(function(response) {
        // Store results for the specific endpoint
        scope.lastSuggestions[options.url] = response;
        return response;
      });
    }
    // Initialize last suggestions storage
    scope.lastSuggestions = {};
    // Attach to the scope
    scope.autocompleteSuggest = autocompleteSuggest;
  }

  /**
    * Choose template for record form
    * @memberof invenioRecordsForm
    * @param {service} element - Element that this directive is assigned to.
    * @param {service} attrs - Attribute of this element.
    * @example
    *    Minimal template `template.html` usage
    *      <form
    *       sf-schema="vm.invenioRecordsSchema"
    *       sf-form="vm.invenioRecordsForm"
    *       sf-model="vm.invenioRecordsModel">
    *      </form>
    */
  function templateUrl(element, attrs) {
    return attrs.template;
  }

  ////////////

  return {
    restrict: 'AE',
    link: link,
    scope: false,
    require: '^invenioRecords',
    templateUrl: templateUrl,
  };
}

invenioRecordsForm.$inject = [
  '$q',
  'schemaFormDecorators',
  'InvenioRecordsAPI',
  '$httpParamSerializerJQLike'
];

angular.module('invenioRecords.directives')
  .directive('invenioRecordsForm', invenioRecordsForm);
