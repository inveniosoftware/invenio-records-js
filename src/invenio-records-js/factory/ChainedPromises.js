/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
  * @ngdoc factory
  * @name ChainedPromise
  * @namespace ChainedPromise
  * @param {service} $q - Angular promise services.
  * @description
  *     Handles chained promises
  */
function ChainedPromise($q) {

  var chained = {};
  /**
    * Make chained promises
    * @memberof ChainedPromise
    * @function promise
    * @param {Object} promises - A list with promise callbacks
    */
  chained.promise = function(promises) {
    var defer = $q.defer();
    var data = [];

    function _chain(fn) {
      fn().then(
        function(_data) {
          data.push(_data);
          if (promises.length > 0) {
            return _chain(promises.shift());
          } else {
            defer.resolve(data);
          }
        }, function(error) {
          defer.reject(error);
        }
      );
    }
    _chain(promises.shift());
    return defer.promise;
  };

  return chained;
}

ChainedPromise.$inject = [
  '$q',
];

angular.module('invenioRecords.factories')
  .factory('ChainedPromise', ChainedPromise);
