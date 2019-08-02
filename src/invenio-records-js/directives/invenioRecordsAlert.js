/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

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

angular.module('invenioRecords.directives')
  .directive('invenioRecordsAlert', invenioRecordsAlert);
