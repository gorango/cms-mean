'use strict';

/**
 * Module dependencies
 */
var officePolicy = require('../policies/office.server.policy'),
  office = require('../controllers/office.server.controller');

module.exports = function (app) {
  // Office collection routes
  app.route('/api/office').all(officePolicy.isAllowed)
    .get(office.ping);
};
