'use strict';

/**
 * Module dependencies
 */
var filesPolicy = require('../policies/files.server.policy'),
  files = require('../controllers/files.server.controller');

module.exports = function (app) {
  app.route('/api/files').all(filesPolicy.isAllowed)
    .get(files.exportFile)
    .post(files.importFromFile);
};
