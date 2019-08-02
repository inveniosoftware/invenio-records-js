/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

// Karma configuration

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
      'chai-jquery',
      'jquery-1.8.3',
      'sinon-chai',
    ],

    plugins: [
      'karma-chai',
      'karma-chai-jquery',
      'karma-coverage',
      'karma-jquery',
      'karma-mocha',
      'karma-ng-html2js-preprocessor',
      'karma-phantomjs-launcher',
      'karma-read-json',
      'karma-sinon-chai',
      'karma-spec-reporter',
    ],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-strap/dist/angular-strap.js',
      'node_modules/angular-strap/dist/angular-strap.tpl.js',
      'node_modules/objectpath/lib/ObjectPath.js',
      'node_modules/tv4/tv4.js',
      'node_modules/angular-underscore/index.js',
      'node_modules/angular-ui-utils/modules/utils.js',
      'node_modules/angular-ui-select/select.js',
      'node_modules/objectpath/lib/ObjectPath.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/karma-read-json/karma-read-json.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-translate/dist/angular-translate.js',
      'node_modules/angular-schema-form/dist/schema-form.js',
      'node_modules/angular-schema-form/dist/bootstrap-decorator.js',
      'node_modules/angular-schema-form-dynamic-select/angular-schema-form-dynamic-select.js',
      'src/*/*.js',
      'src/**/*.js',
      'src/**/*.html',
      'test/unit/**/*.js',
      'test/e2e/**/*.js',
      {pattern: 'test/fixtures/**/*.json', included: false},
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['coverage'],
      'src/**/*.html': ['ng-html2js']
    },

    // Coverage reporter
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'text'},
        {type: 'html', subdir: 'report-html'},
        {type: 'lcov', subdir: 'report-lcov'}
      ]
    },


    // load templates as module
    ngHtml2JsPreprocessor: {
      moduleName: 'templates'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'spec', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
