/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

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
    * @param {service} element - Element that this directive is assigned to.
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

angular.module('invenioRecords.directives')
  .directive('invenioRecordsActions', invenioRecordsActions);
