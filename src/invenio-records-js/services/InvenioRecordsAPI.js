/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
  * @ngdoc service
  * @name InvenioRecordsAPI
  * @namespace InvenioRecordsAPI
  * @param {service} $http - Angular http requests service.
  * @param {service} $q - Angular promise service.
  * @description
  *     Call the records API
  */
function InvenioRecordsAPI($http, $q) {

  /**
    * Make a request to the API
    * @memberof InvenioRecordsAPI
    * @param {Object} args - The request parameters.
    * @returns {service} promise
    */
  function request(args) {
    // Make the request
    return $http(args);
  }

  /**
    * Make a GET request to the API
    * @memberof InvenioRecordsAPI
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

  /**
    * Clean the data from unwanted values
    * @memberof InvenioRecordsAPI
    * @param {Object} data - Provided by ``extra-params.data``.
    * @param {Object} unwanted - A list with unwanted values.
    */
  function cleanData(data, unwanted) {
    var _unwantend = unwanted || [[null], [{}], '', [undefined]];
    angular.forEach(data, function(value, key) {
      angular.forEach(_unwantend, function(_value) {
        if (angular.equals(_value, value))  {
          delete data[key];
        }
      });
    });
    return data;
  }

  /**
    * Prepare the request data
    * @memberof InvenioRecordsAPI
    * @param {Object} model -The data model.
    * @param {Object} extraParams - Provided by ``extra-params``.
    * @param {Object} endpoints - Endpoints defined during the initialization.
    */
  function getData(model, extraParams, endpoints) {
    // Prepare the data for the request
    // Someone could use decorators and change the data
    var data = angular.merge(
      {},
      extraParams.data || {},
      cleanData(model)
    );
    // Add the schema if is not already defined
    if (data.$schema === undefined && endpoints.schema !== undefined) {
      data.$schema = endpoints.schema;
    }
    return data;
  }

  /**
    * Prepare the request object
    * @memberof InvenioRecordsAPI
    * @param {String} url - The request url.
    * @param {String} method - The request method.
    * @param {Object} model -The data model.
    * @param {Object} extraParams - Provided by ``extra-params``.
    * @param {Object} endpoints - Endpoints defined during the initialization.
    * @returns {Object} requestObject
    */
  function prepareRequest(url, method, model, extraParams, endpoints) {
    // build the requestObject
    var requestObject = {
      url: url,
      method: method,
      headers: extraParams.headers || {},
      data: getData(model, extraParams, endpoints)
    };
    return requestObject;
  }

  return {
    cleanData: cleanData,
    get: get,
    getData: getData,
    prepareRequest: prepareRequest,
    request: request,
  };
}

InvenioRecordsAPI.$inject = ['$http', '$q'];

angular.module('invenioRecords.services')
  .service('InvenioRecordsAPI', InvenioRecordsAPI);
