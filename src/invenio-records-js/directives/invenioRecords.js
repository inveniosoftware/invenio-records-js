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
    * @param {InvenioRecordsCtrl} vm - Invenio records controller.
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
    controller: 'InvenioRecordsCtrl',
    controllerAs: 'recordsVM',
    link: link,
  };
}

angular.module('invenioRecords.directives')
  .directive('invenioRecords', invenioRecords);
