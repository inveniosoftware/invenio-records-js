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
