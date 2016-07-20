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

(function (angular) {

  // Controllers

  /**
   * @ngdoc controller
   * @name invenioRecordsController
   * @namespace invenioRecordsController
   * @description
   *    Invenio records controller.
   */
  function invenioRecordsController($scope, $rootScope, $q, $timeout,
      invenioRecordsAPI) {

    // Parameters

    // Assign the controller to `vm`
    var vm = this;

    // The request args
    vm.invenioRecordsArgs = {
      url: '/',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // The form model
    vm.invenioRecordsModel = null;
    // Set endpoints
    vm.invenioRecordsEndpoints = null;

    // Record Loading - If the invenioRecords has the state loading
    vm.invenioRecordsLoading = true;

    // Record Alerts - if the invenioRecords has any alert
    vm.invenioRecordsAlert = null;

    ////////////

    // Functions

    /**
     * Set record schema.
     * @memberof invenioRecordsController
     * @functioninvenioRecordsSetSchema
     */
    function invenioRecordsSetSchema(response) {
      vm.invenioRecordsSchema = response.data;
    }

    /**
     * Set form schema.
     * @memberof invenioRecordsController
     * @function invenioRecordsSetForm
     */
    function invenioRecordsSetForm(response) {
      vm.invenioRecordsForm = response.data;
    }

    /**
     * Initialize the controller
     * @memberof invenioRecordsController
     * @function invenioRecordsInit
     * @param {Object} evt - The event object.
     * @param {Object} args - The invenio records arguments.
     * @param {Object} endpoints - The invenio endpoints for actions.
     * @param {Object} record - The record object.
     */
    function invenioRecordsInit(evt, args, endpoints, record) {
      // Start loading
      $rootScope.$broadcast('invenio.records.loading.start');
      // Assign the model
      vm.invenioRecordsModel = angular.copy(record);
      // Assign the args
      vm.invenioRecordsArgs = angular.merge(
        {},
        vm.invenioRecordsArgs,
        args
      );
      // Assign endpoints
      vm.invenioRecordsEndpoints = angular.merge(
        {},
        endpoints
      );

      // Get the schema and the form
      $q.all([
        invenioRecordsAPI.get(vm.invenioRecordsEndpoints.schema)
          .then(invenioRecordsSetSchema),
        invenioRecordsAPI.get(vm.invenioRecordsEndpoints.form)
          .then(invenioRecordsSetForm)
      ]).then(function() {
        // Remove loading state
        $rootScope.$broadcast('invenio.records.loading.stop');
      });
    }

    /**
     * Records actions
     * @memberof invenioRecordsController
     * @function invenioRecordsActions
     * @param {Object} evt - The event object.
     * @param {String} type - The invenio action type.
     * @param {Object} successCallback - Call function after success.
     * @param {Object} errorCallback - Call function after error..
     */
    function invenioRecordsActions(evt, type, successCallback, errorCallback) {

      function getEndpoints(){
        var deferred = $q.defer();
        if(vm.invenioRecordsEndpoints.self === undefined || type === 'publish') {
          // If the action url doesnt exists request it
          invenioRecordsAPI.request({
            method: vm.invenioRecordsModel.recid ? 'GET' : 'POST',
            url: vm.invenioRecordsEndpoints.initialization,
            data: {},
            headers: vm.invenioRecordsArgs.headers || {}
          }).then(function success(response) {
            // Upadate the endpoints
            $rootScope.$broadcast(
              'invenio.records.endpoints.updated', response.data.links
            );
            deferred.resolve({});
          }, function error(response) {
            // Error
            deferred.reject(response);
          });
        } else {
          // We already have it resolve it asap
          deferred.resolve({});
        }
        return deferred.promise;
      }

      // Get the endpoints and do the request
      getEndpoints().then(
        function success() {
          var _data = angular.merge({}, vm.invenioRecordsModel);

          var unwatend = [[null], [{}], '', [undefined]];
          angular.forEach(_data, function(value, key) {
            angular.forEach(unwatend, function(_value) {
              if (angular.equals(_value, value))  {
                delete _data[key];
              }
            });
          });

          if (vm.invenioRecordsEndpoints[type] !== undefined) {
            var method = (type === 'delete') ? 'DELETE': 'PUT';
            if (type === 'publish') {
              method = 'POST';
            }
            $timeout(function() {
              invenioRecordsAPI.request({
                url: vm.invenioRecordsEndpoints[type],
                method: method,
                data: {
                  metadata: _data
                },
                headers: vm.invenioRecordsArgs.headers || {}
              }).then(
                successCallback,
                errorCallback
              );
            }, 2000);
          } else {
            errorCallback({
              type: 'danger',
              data: {
                message: 'The action type is not supported'
              }
            });
          }
        },
        errorCallback);
    }

    /**
     * Action handler
     * @memberof invenioRecordsController
     * @function invenioRecordsHandler
     */
    function invenioRecordsHandler(type) {

      /**
       * After a successful request
       * @memberof invenioRecordsHandler
       * @function actionSuccessful
       * @param {Object} response - The action request response.
       */
      function actionSuccessful(response) {
        $rootScope.$broadcast('invenio.records.alert', {
          type: 'success',
          data: response.data,
          action: type
        });

        // Trigger successful event for action
        $rootScope.$broadcast('invenio.records.action.success', type);

        // Stop loadig idicator
        $rootScope.$broadcast('invenio.records.loading.stop');
      }
      /**
       * After an errored request
       * @memberof invenioRecordsHandler
       * @function actionErrored
       * @param {Object} response - The action request response.
       */
      function actionErrored(response) {
        $rootScope.$broadcast('invenio.records.alert', {
          type: 'danger',
          data: response.data,
          action: type
        });

        if (response.data.status === 400 && response.data.errors) {
          var deferred = $q.defer();
          var promise = deferred.promise;
          promise.then(function displayValidationErrors() {
            angular.forEach(response.data.errors, function(value) {
              try {
                $scope.$broadcast(
                  'schemaForm.error.' + value.field.replace('metadata.', ''),
                  'backendValidationError',
                  value.message
                );
              } catch(error) {
                $scope.$broadcast(
                  'schemaForm.error.' + value.field,
                  'backendValidationError',
                  value.message
                );
              }
            });
          }).then(function stopLoading() {
            $rootScope.$broadcast('invenio.records.loading.stop');
          });
          deferred.resolve();
        } else {
          $rootScope.$broadcast('invenio.records.loading.stop');
        }
        // Trigger successful event for action
        $rootScope.$broadcast('invenio.records.action.error', response.data);
      }

      // Start loading
      $rootScope.$broadcast('invenio.records.loading.start');

      // Request submission
      $scope.$broadcast(
        'invenio.records.action',
        type,
        actionSuccessful,
        actionErrored
      );
    }

    /**
      * Remove validation error
      * @memberof invenioRecordsController
      * @function invenioRecordsRemoveValidation
      * @param {Object} fieldValue - The filed value.
      * @param {Object} form - The form object.
      */
    function invenioRecordsRemoveValidation(fieldValue, form) {
      // Reset validation only if the filed has been changed
      if (form.validationMessage) {
        // If the field has changed remove the error
        $scope.$broadcast(
          'schemaForm.error.' + form.key.join('.'),
          'backendValidationError',
          true
        );
      }
    }

    /**
      * Change the state to loading
      * @memberof invenioRecordsController
      * @function invenioRecordsLoadingStart
      * @param {Object} evt - The event object.
      */
    function invenioRecordsLoadingStart(evt) {
      // Set the state to loading
      vm.invenioRecordsLoading = true;
    }

    /**
      * Change the state to normal
      * @memberof invenioRecordsController
      * @function invenioRecordsLoadingStop
      * @param {Object} evt - The event object.
      */
    function invenioRecordsLoadingStop(evt) {
      // Set the state to normal
      vm.invenioRecordsLoading = false;
    }

    /**
      * Show alert messages
      * @memberof invenioRecordsController
      * @function invenioRecordsAlert
      * @param {Object} evt - The event object.
      * @param {Object} data - The object with the alert data.
      */
    function invenioRecordsAlert(evt, data) {
      // Reset the error
      vm.invenioRecordsAlert = null;
      // Attach the error to the scope
      vm.invenioRecordsAlert = data;
    }

    /**
      * Prepare the form after the action
      * @memberof invenioRecordsController
      * @function invenioRecordsActionFinished
      * @param {Object} evt - The event object.
      * @param {Object} type - The action type
      */
    function invenioRecordsActionSuccess(evt, type) {
      // Set the form to pristine if it's self or publish
      if (['publish', 'self'].indexOf(type) > -1) {
        $scope.depositionForm.$setPristine();
        // Set the form to submitted if it's published
        if (type === 'publish') {
          $scope.depositionForm.$setSubmitted();
        }
      }
      // Set the form to $invalid if it's deleted/discarded
    }

    /**
      * Updating the endpoints
      * @memberof invenioRecordsController
      * @function invenioRecordsEndpointsUpdated
      * @param {Object} evt - The event object.
      * @param {Object} endpoints - The object with the endpoints.
      */
    function invenioRecordsEndpointsUpdated(evt, endpoints) {
      vm.invenioRecordsEndpoints = angular.merge(
        {
          'delete': endpoints.self,
        },
        vm.invenioRecordsEndpoints,
        endpoints
      );
    }

    // Attach fuctions to the scope

    // Action handler
    vm.actionHandler = invenioRecordsHandler;
    // Remove validation
    vm.removeValidationMessage = invenioRecordsRemoveValidation;

    ////////////

    // Listener

    // Local

    // When invenio.records action requested
    $scope.$on('invenio.records.action', invenioRecordsActions);

    // When the module initialized
    $scope.$on('invenio.records.init', invenioRecordsInit);

    // Global - Until a unified invenio angular module

    // When there is an error
    $rootScope.$on('invenio.records.alert', invenioRecordsAlert);

    // When loading requested to start
    $rootScope.$on('invenio.records.loading.start', invenioRecordsLoadingStart);
    // When loading requested to stop
    $rootScope.$on('invenio.records.loading.stop', invenioRecordsLoadingStop);

    // When the ``public`` action finishes without errors
    $rootScope.$on(
      'invenio.records.action.success', invenioRecordsActionSuccess
    );

    // Update endpoints
    $rootScope.$on(
      'invenio.records.endpoints.updated', invenioRecordsEndpointsUpdated
    );
  }

  // Inject depedencies
  invenioRecordsController.$inject = [
    '$scope',
    '$rootScope',
    '$q',
    '$timeout',
    'invenioRecordsAPI',
  ];

  ////////////

  // Services

  /**
   * @ngdoc service
   * @name invenioRecordsAPI
   * @namespace invenioRecordsAPI
   * @param {service} $http - Angular http requests service.
   * @param {service} $q - Angular promise service.
   * @description
   *     Call the records API
   */
  function invenioRecordsAPI($http, $q) {

    /**
     * Make a request to the API
     * @memberof invenioRecordsAPI
     * @param {Object} args - The request parameters.
     * @returns {service} promise
     */
    function request(args) {
      // Make the request
      return $http(args);
    }

    /**
     * Make a GET request to the API
     * @memberof invenioRecordsAPI
     * @param {Object} args - The request parameters.
     * @returns {service} promise
     */
    function get(url) {
      // If the url is empty just return a resolved promise
      if (url === null) {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      }
      // Sugar goodies, just make a GET request
      var args = {
        url: url,
        method: 'GET'
      };
      return request(args);
    }

    return {
      get: get,
      request: request,
    };
  }

  invenioRecordsAPI.$inject = ['$http', '$q'];

  ////////////

  // Directives

  /**
   * @ngdoc directive
   * @name invenioRecords
   * @description
   *    The invenioRecords directive handler
   * @namespace invenioRecords
   * @example
   *    Usage:
   *     <invenio-records
   *      action="http://"
   *      extra-params='{}'
   *      form="http://"
   *      initialization="http://"
   *      record='record'
   *      schema="http://">
   *     </invenio-records>
   *
   */
  function invenioRecords() {

    // Functions

    /**
     * Initialize directive
     * @memberof invenioRecords
     * @param {service} scope -  The scope of this element.
     * @param {service} element - Element that this directive is assigned to.
     * @param {service} attrs - Attribute of this element.
     * @param {invenioRecordsController} vm - Invenio records controller.
     */
    function link(scope, element, attrs, vm) {

      // Upadate parameters
      var collectedArgs = {
        method: attrs.actionMethod || 'GET'
      };

      // Get alert messages
      var responseParams = {
        responseParams: JSON.parse(attrs.responseParams || '{}')
      };

      // Get any extras
      var extraParams = JSON.parse(attrs.extraParams || '{}');

      // Merge together
      var args = angular.merge(
        {},
        collectedArgs,
        responseParams,
        extraParams
      );

      // Get the endpoints for schemas
      var endpoints = {
        form: attrs.form || null,
        initialization: attrs.initialization || null,
        schema: attrs.schema || null
      };

      // Get the record object
      var record = JSON.parse(attrs.record || '{}');

      // Spread the love of initialization
      scope.$broadcast(
        'invenio.records.init', args, endpoints, record
      );
    }

    ////////////

    return {
      restrict: 'AE',
      scope: false,
      controller: 'invenioRecordsController',
      controllerAs: 'recordsVM',
      link: link,
    };
  }

  /**
   * @ngdoc directive
   * @name invenioRecordsLoading
   * @description
   *    The invenio records loading directive handler
   * @namespace invenioRecordsLoading
   * @example
   *    Usage:
   *     <invenio-records-loading
   *      template="http://loading.html">
   *     </invenio-records-loading>
   *
   */
  function invenioRecordsLoading() {

    // Functions

    /**
     * Choose template for record loading
     * @memberof invenioRecordsLoading
     * @param {service} element - Element that this directive is assigned to.
     * @param {service} attrs - Attribute of this element.
     * @example
     *    Minimal template `template.html` usage
     *    {{ vm.invenioRecordsLoading }}
     */
    function templateUrl(element, attrs) {
      return attrs.template;
    }

    ////////////

    return {
      restrict: 'AE',
      scope: false,
      require: '^invenioRecords',
      templateUrl: templateUrl,
    };
  }

  /**
   * @ngdoc directive
   * @name invenioRecordsAlert
   * @description
   *    The invenio records alert directive handler
   * @namespace invenioRecordsAlert
   * @example
   *    Usage:
   *     <invenio-records-alert
   *      template="http://alert.html">
   *     </invenio-records-alert>
   *
   */
  function invenioRecordsAlert() {

    // Functions

    /**
     * Choose template for record alert
     * @memberof invenioRecordsAlert
     * @param {service} element - Element that this directive is assigned to.
     * @param {service} attrs - Attribute of this element.
     * @example
     *    Minimal template `template.html` usage
     *    {{ vm.invenioRecordsAlert }}
     */
    function templateUrl(element, attrs) {
      return attrs.template;
    }

    ////////////

    return {
      restrict: 'AE',
      scope: false,
      require: '^invenioRecords',
      templateUrl: templateUrl,
    };
  }

  /**
   * @ngdoc directive
   * @name invenioRecordsActions
   * @description
   *    The invenio records action directive handler
   * @namespace invenioRecordsActions
   * @example
   *    Usage:
   *     <invenio-records-actions
   *      template="">
   *     </invenio-records-actions>
   *
   */
  function invenioRecordsActions() {

    // Functions

    /**
     * Choose template for record actions
     * @memberof invenioRecordsActions
     * @param {service} element - Element that this directive is assigned to.
     * @param {service} attrs - Attribute of this element.
     * @example
     *    Minimal template `template.html` usage
     *      <a href="#" ng-click="vm.actionSave()">Save</a>
     */
    function templateUrl(element, attrs) {
      return attrs.template;
    }

    ////////////

    return {
      restrict: 'AE',
      scope: false,
      require: '^invenioRecords',
      templateUrl: templateUrl,
    };
  }

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
  function invenioRecordsForm($q, schemaFormDecorators, invenioRecordsAPI,
    $httpParamSerializerJQLike) {

    // Functions

    /**
     * Initialize directive
     * @memberof invenioRecords
     * @param {service} scope -  The scope of this element.
     * @param {service} element - Element that this directive is assigned to.
     * @param {service} attrs - Attribute of this element.
     * @param {invenioRecordsController} vm - Invenio records controller.
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
      function _errorOrEmppty(){
        var defer = $q.defer();
        defer.resolve({data: []});
        return defer.promise;
      }

      /**
       * Handle the autocomplete request
       * @memberof invenioRecordsFrom
       * @function _suggestEngine
       * @param {Object} args - The arguments for the request.
       * @param {Object} keyProperty - The results key.
       */
      function _suggestEngine(args, keyProperty) {
        if (args.url !== undefined) {
          return invenioRecordsAPI.request(args)
            .then(
              function success(response) {
                return {
                  data: getProp(response.data, keyProperty)
                };
              },
              _errorOrEmppty
            );
        }
        return _errorOrEmppty();
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
              if (key === 'text' && value === 'value'){
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
        if (query && options.url !== undefined) {
          // Parse the url parameters
          args = angular.extend({},
            {
              url: _urlParser(options.url, options.urlParameters, query),
              method: 'GET',
              data: options.data || {},
              headers: options.headers || vm.invenioRecordsArgs.headers
            }
          );
        }
        return _suggestEngine(args, options.map.resultsProperty);
      }
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
    'invenioRecordsAPI',
    '$httpParamSerializerJQLike'
  ];

  ///////////////

  // Put everything together

  // Controllers
  angular.module('invenioRecords.controllers', [])
    .controller('invenioRecordsController', invenioRecordsController);

  // Services
  angular.module('invenioRecords.services', [])
    .service('invenioRecordsAPI', invenioRecordsAPI);

  // Directives
  angular.module('invenioRecords.directives', ['schemaForm'])
    .directive('invenioRecords', invenioRecords)
    .directive('invenioRecordsAlert', invenioRecordsAlert)
    .directive('invenioRecordsLoading', invenioRecordsLoading)
    .directive('invenioRecordsActions', invenioRecordsActions)
    .directive('invenioRecordsForm', invenioRecordsForm);

  // Setup everyhting
  angular.module('invenioRecords' , [
    'invenioRecords.services',
    'invenioRecords.controllers',
    'invenioRecords.directives',
  ]);

  //////////// HAPPY EDITING :)

})(angular);
