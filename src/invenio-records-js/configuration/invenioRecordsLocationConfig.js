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
