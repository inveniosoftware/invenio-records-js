/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
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
  *      links="{}"
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
    // Get extra template parameters
    var templateParams = {
      templateParams: JSON.parse(attrs.templateParams || '{}')
    };

    // Get any extras
    var extraParams = JSON.parse(attrs.extraParams || '{}');

    // Get any extras
    var links = JSON.parse(attrs.links || '{}');

    // Merge together
    var args = angular.merge(
      {},
      templateParams,
      extraParams
    );

    // Get the endpoints for schemas
    var endpoints = {
      form: attrs.form,
      initialization: attrs.initialization,
      schema: attrs.schema,
    };
    // Get the record object
    var record = JSON.parse(attrs.record || '{}');
    // Spread the love of initialization
    scope.$broadcast(
      'invenio.records.init', args, endpoints, record, links
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
