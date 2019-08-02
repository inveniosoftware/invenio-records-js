/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

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

angular.module('invenioRecords.directives')
  .directive('invenioRecordsLoading', invenioRecordsLoading);
