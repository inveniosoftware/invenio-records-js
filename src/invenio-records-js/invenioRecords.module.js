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
  function invenioRecordsController($scope, $q, invenioRecordsAPI) {

    // Parameters

    // Assign the controller to `vm`
    var vm = this;

    // The request args
    vm.invenioRecordsArgs = {
      url: '/',
      method: 'GET'
    };

    // The form model
    vm.invenioRecordsModel = {};
    // Set loading
    vm.invenioRecordsLoading = true;
    // Set endpoints
    vm.invenioRecordsEndpoints = {};
    // Set errors
    vm.invenioRecordsError = {};
    // Set notify
    vm.invenioRecordsNotify = false;

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
     * @function invenioRecordsInitialize
     * @param {Object} evt - The event object.
     * @param {Object} args - The invenio records arguments.
     * @param {Object} endpoints - The invenio endpoints for actions.
     * @param {Object} record - The record object.
     */
    function invenioRecordsInitialize(evt, args, endpoints, record) {
      // Assign the model
      vm.invenioRecordsModel = angular.copy(record);
      // Assign the args
      vm.invenioRecordsArgs = angular.merge(
        {},
        vm.invenioRecordsArgs,
        args
      );
      vm.invenioRecordsEndpoints = angular.merge(
        {},
        endpoints
      );

      // Get the schema and the form
      $q.all([
        invenioRecordsAPI.get(vm.invenioRecordsEndpoints.schema).then(
          invenioRecordsSetSchema
        ),
        invenioRecordsAPI.get(vm.invenioRecordsEndpoints.form).then(
          invenioRecordsSetForm
        )
      ]).then(function() {
        vm.invenioRecordsLoading = false;
      });
    }

    // FIXME: Add me to a nice factory :)
    /**
     * Initialize the controller
     * @memberof invenioRecordsController
     * @function invenioRecordsActions
     * @param {Object} evt - The event object.
     * @param {Object} args - The invenio records arguments.
     * @param {Object} successCallback - Call function after success.
     * @param {Object} errorCallback - Call function after error..
     */
    function invenioRecordsActions(evt, args, successCallback, errorCallback) {
      // Set loading to true
      vm.invenioRecordsLoading = true;
      // Reset any errors
      vm.invenioRecordsError = {};
      // Reset any notifications
      vm.invenioRecordsNotify = false;
      // Make the request
      invenioRecordsAPI.request(args)
        .then(
          successCallback || angular.noop,
          errorCallback || angular.noop
        ).finally(function() {
          vm.invenioRecordsLoading = false;
        });
    }

    /**
     * Save the record
     * @memberof invenioRecordsController
     * @function actionSave
     */
    function actionSave() {
      // POST
      var args = angular.copy(vm.invenioRecordsArgs);
      args.data = angular.copy(vm.invenioRecordsModel);
      args.method = 'PUT';

      /**
       * After a successful request
       * @memberof actionSave
       * @function _successfulSave
       * @param {Object} response - The action request response.
       */
      function _successfulSave(response) {
        vm.invenioRecordsNotify = response.data || 'Success';
      }

      /**
       * After an errored request
       * @memberof actionSave
       * @function _erroredSave
       * @param {Object} response - The action request response.
       */
      function _erroredSave(response) {
        vm.invenioRecordsError = response;
      }

      // Request submission
      $scope.$broadcast(
        'invenio.records.action', args, _successfulSave, _erroredSave
      );
    }

    /**
     * Delete the record
     * @memberof invenioRecordsController
     * @function actionDelete
     */
    function actionDelete() {
      // DELETE
      var args = angular.copy(vm.invenioRecordsArgs);
      args.method = 'DELETE';

      /**
       * After a successful request
       * @memberof actionDelete
       * @function _successfulDelete
       * @param {Object} response - The action request response.
       */
      function _successfulDelete(response) {
        console.log('Deleting....', response);
        vm.invenioRecordsNotify = response.data || 'Successfully deleted!';
      }

      /**
       * After an errored request
       * @memberof actionDelete
       * @function _erroredDelete
       * @param {Object} response - The action request response.
       */
      function _erroredDelete(response) {
        vm.invenioRecordsError = response;
      }
      // Request deletion
      $scope.$broadcast(
        'invenio.records.action', args, _successfulDelete, _erroredDelete
      );
    }

    // Attach fuctions to the scope

    vm.actionSave = actionSave;
    vm.actionDelete = actionDelete;

    ////////////

    // Listeners

    // When invenio.records initialization requested
    $scope.$on(
      'invenio.records.initialization', invenioRecordsInitialize
    );
    // When invenio.records action requested
    $scope.$on(
      'invenio.records.action', invenioRecordsActions
    );
  }

  // Inject depedencies
  invenioRecordsController.$inject = ['$scope', '$q', 'invenioRecordsAPI'];

  ////////////

  // Services

  /**
   * @ngdoc service
   * @name invenioRecordsAPI
   * @namespace invenioRecordsAPI
   * @param {service} $http - Angular http requests service.
   * @description
   *     Call the records API
   */
  function invenioRecordsAPI($http) {

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

  invenioRecordsAPI.$inject = ['$http'];

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
   *      action-endpoint=""
   *      extra-params='{}'
   *      form="http://"
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
        url: attrs.actionEndpoint,
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
        schema: attrs.schema,
        form: attrs.form
      };
      // Get the record object
      var record = JSON.parse(attrs.record || '{}');

      // Spread the love of initialization
      scope.$broadcast(
        'invenio.records.initialization', args, endpoints, record
      );
    }

    ////////////

    return {
      restrict: 'AE',
      scope: false,
      controller: 'invenioRecordsController',
      controllerAs: 'vm',
      link: link,
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

  // Controllers
  angular.module('invenioRecords.controllers', [])
    .controller('invenioRecordsController', invenioRecordsController);

  // Services
  angular.module('invenioRecords.services', [])
    .service('invenioRecordsAPI', invenioRecordsAPI);

  // Directives
  angular.module('invenioRecords.directives', [])
    .directive('invenioRecords', invenioRecords)
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
