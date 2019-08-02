/*
 * This file is part of Invenio.
 * Copyright (C) 2016-2019 CERN.
 *
 * Invenio is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

angular.module('invenioRecords.config', []);
angular.module('invenioRecords.controllers', []);
angular.module('invenioRecords.directives', []);
angular.module('invenioRecords.factories', []);
angular.module('invenioRecords.services', []);

// Setup everyhting
angular.module('invenioRecords', [
  'schemaForm',
  'invenioRecords.config',
  'invenioRecords.factories',
  'invenioRecords.services',
  'invenioRecords.controllers',
  'invenioRecords.directives',
]);
