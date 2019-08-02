/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */
/**
 * @ngdoc interface
 * @name invenioRecordsConfiguration
 * @namespace invenioRecordsConfiguration
 * @param {service} $locationProvider - Angular window.location provider.
 * @description
 *     Enable HTML5 mode in urls
 */
function invenioRecordsConfiguration($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
    rewriteLinks: false,
  });
}

// Inject the necessary angular services
invenioRecordsConfiguration.$inject = ['$locationProvider'];

angular.module('invenioRecords.config')
  .config(invenioRecordsConfiguration);
