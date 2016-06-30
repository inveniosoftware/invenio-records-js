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
  function invenioRecordsController($scope, $q, invenioRecordsAPI,
      InvenioRecordsActionsHandler) {

    // Parameters

    // Assign the controller to `vm`
    var vm = this;

    // The request args
    vm.invenioRecordsArgs = {
      url: '/',
      method: 'GET'
    };

    // The form model
    vm.invenioRecordsModel = null;
    // Set endpoints
    vm.invenioRecordsEndpoints = null;

    // Record Loading - If the invenioRecords has the state loading
    vm.invenioRecordsLoading = true;

    // Record Error - if the invenioRecords has any error
    vm.invenioRecordsError = null;

    // Record Warn - if the invenioRecords has any warning
    vm.invenioRecordsWarning = null;

    // Set action handler if everything is ok
    var Handler = new InvenioRecordsActionsHandler();

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
        // Pass the endpoints to the factory
        Handler.setEndpoint(vm.invenioRecordsEndpoints);
        // Remove loading state
        $scope.$broadcast('invenio.records.loading.stop');
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
      // Set loading to true
      $scope.$broadcast('invenio.records.loading.start');
      // If the type function exists run it
      if (typeof Handler[type] === 'function') {
        // Make the request iff the type exists
        // otherwise ignore
        Handler[type]()
          .then(
            successCallback || angular.noop,
            errorCallback || angular.noop
          ).finally(function() {
            // Set loading to stop
            $scope.$broadcast('invenio.records.loading.stop');
          });
      }
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
       * @function _actionSuccessful
       * @param {Object} response - The action request response.
       */
      function _actionSuccessful(response) {
        $scope.$broadcast('invenio.records.warn', response);
      }

      /**
       * After an errored request
       * @memberof invenioRecordsHandler
       * @function _actionErrored
       * @param {Object} response - The action request response.
       */
      function _actionErrored(response) {
        $scope.$broadcast('invenio.records.error', response);
      }

      // Request submission
      $scope.$broadcast(
        'invenio.records.action',
        type,
        _actionSuccessful,
        _actionErrored
      );
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
      * Show error messages
      * @memberof invenioRecordsController
      * @function invenioRecordsError
      * @param {Object} evt - The event object.
      * @param {Object} error - The object with the errors.
      */
    function invenioRecordsError(evt, error) {
      // Reset the error
      vm.invenioRecordsError = null;
      // Attach the error to the scope
      vm.invenioRecordsError = error;
    }

    /**
      * Show warning messages
      * @memberof invenioRecordsController
      * @function invenioRecordsWarn
      * @param {Object} evt - The event object.
      * @param {Object} warning - The object with the warnings.
      */
    function invenioRecordsWarn(evt, warning) {
      // Reset the error
      vm.invenioRecordsWarning = null;
      // Attach the warning to the scope
      vm.invenioRecordsWarning = warning;
    }

    // Attach fuctions to the scope
    vm.actionHandler = invenioRecordsHandler;

    ////////////

    // Listeners

    // When invenio.records action requested
    $scope.$on('invenio.records.action', invenioRecordsActions);

    // When the module initialized
    $scope.$on('invenio.records.init', invenioRecordsInit);

    // When there is an error
    $scope.$on('invenio.records.error', invenioRecordsError);
    // When there is a warning
    $scope.$on('invenio.records.warn', invenioRecordsWarn);

    // When loading requested to start
    $scope.$on('invenio.records.loading.start', invenioRecordsLoadingStart);
    // When loading requested to stop
    $scope.$on('invenio.records.loading.stop', invenioRecordsLoadingStop);
  }

  // Inject depedencies
  invenioRecordsController.$inject = [
    '$scope',
    '$q',
    'invenioRecordsAPI',
    'invenioRecordsActionsHandler',
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

  // Factories

  /**
   * @ngdoc factory
   * @namei invenioRecordsActionsHandler
   * @namespace invenioRecordsActionsHandler
   * @param {service} invenioRecordsAPI - Invenio Records API.
   * @param {service} $q - Angular promise service.
   * @description
   *     Call the records API
   */
  function invenioRecordsActionsHandler(invenioRecordsAPI, $q, $rootScope) {

    function Actions(endpoints) {
      this.endpoints = angular.copy(endpoints);
    }

    function _handler(args) {
      return invenioRecordsAPI.request(args);
    }

    Actions.prototype.setEndpoint = function(endpoints) {
      this.endpoints = angular.merge(
        {},
        this.endpoints,
        endpoints
      );
    };

    Actions.prototype.getEndpoint = function() {
      return this.endpoints;
    };

    Actions.prototype.create = function() {
      var that = this;
      var deferred = $q.defer();
      if(that.endpoints.action !== null) {
        // If the action url is present just return it
        deferred.resolve(that.endpoints.action);
      } else {
        // If the action url doesnt exists request it
        invenioRecordsAPI.request({
          url: that.endpoints.initialization,
          method: 'POST'
        }).then(function(response) {
          that.setEndpoint({
            action: response.self
          });
          $rootScope.$broadcast('invenio.deposit.init', response);
          // Resolve the request
          deferred.resolve(response.self);
        });
      }
      return deferred.promise;
    };

    // FIXME: Add a wrapper
    Actions.prototype.save = function() {
      var deferred = $q.defer();
      this.create().then(function(action) {
        _handler({
          url: action,
          method: 'POST'
        }).then(function(response) {
          deferred.resolve(response);
        }, function(response) {
          deferred.reject(response);
        });
      });
      return deferred.promise;
    };

    // FIXME: Add a wrapper
    Actions.prototype.delete = function() {
      var deferred = $q.defer();
      this.create().then(function(action) {
        _handler({
          url: action,
          method: 'DELETE'
        }).then(function(response) {
          deferred.resolve(response);
        }, function(response) {
          deferred.reject(response);
        });
      });
      return deferred.promise;
    };

    ////////////

    return Actions;
  }

  invenioRecordsActionsHandler.$inject = [
    'invenioRecordsAPI', '$q', '$rootScope'
  ];

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
     * @param {service} element - Element that this direcive is assigned to.
     * @param {service} attrs - Attribute of this element.
     * @param {invenioRecordsController} vm - Invenio records controller.
     */
    function link(scope, element, attrs, vm) {

      // Upadate parameters
      var collectedArgs = {
        method: attrs.actionMethod || 'GET'
      };

      // Get any extras
      var extraParams = {
        params: JSON.parse(attrs.extraParams || '{}')
      };

      // Merge together
      var args = angular.merge(
        {},
        collectedArgs,
        extraParams
      );

      // Get the endpoints for schemas
      var endpoints = {
        action: attrs.action || null,
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
   * @name invenioRecordsError
   * @description
   *    The invenio records error directive handler
   * @namespace invenioRecordsError
   * @example
   *    Usage:
   *     <invenio-records-error
   *      template="http://error.html">
   *     </invenio-records-error>
   *
   */
  function invenioRecordsError() {

    // Functions

    /**
     * Choose template for record error
     * @memberof invenioRecordsError
     * @param {service} element - Element that this direcive is assigned to.
     * @param {service} attrs - Attribute of this element.
     * @example
     *    Minimal template `template.html` usage
     *    {{ vm.invenioRecordsError }}
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
     * @param {service} element - Element that this direcive is assigned to.
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
   *      template="">
   *     </invenio-records-form>
   *
   */
  function invenioRecordsForm() {

    // Functions

    /**
     * Choose template for record form
     * @memberof invenioRecordsForm
     * @param {service} element - Element that this direcive is assigned to.
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
      scope: false,
      require: '^invenioRecords',
      templateUrl: templateUrl,
    };
  }

  ///////////////

  // Put everything together

  // Factories
  angular.module('invenioRecords.factories', [])
    .factory('invenioRecordsActionsHandler', invenioRecordsActionsHandler);

  // Controllers
  angular.module('invenioRecords.controllers', [])
    .controller('invenioRecordsController', invenioRecordsController);

  // Services
  angular.module('invenioRecords.services', [])
    .service('invenioRecordsAPI', invenioRecordsAPI);

  // Directives
  angular.module('invenioRecords.directives', [])
    .directive('invenioRecords', invenioRecords)
    .directive('invenioRecordsError', invenioRecordsError)
    .directive('invenioRecordsActions', invenioRecordsActions)
    .directive('invenioRecordsForm', invenioRecordsForm);

  // Setup everyhting
  angular.module('invenioRecords' , [
    'invenioRecords.services',
    'invenioRecords.factories',
    'invenioRecords.controllers',
    'invenioRecords.directives',
  ]);

  //////////// HAPPY EDITING :)

})(angular);
