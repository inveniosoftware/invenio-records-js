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

  return {
    get: get,
    request: request,
  };
}

InvenioRecordsAPI.$inject = ['$http', '$q'];

angular.module('invenioRecords.services')
  .service('InvenioRecordsAPI', InvenioRecordsAPI);
