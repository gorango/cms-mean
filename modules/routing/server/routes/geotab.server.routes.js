'use strict';

/**
 * Module dependencies
 */
var geotabPolicy = require('../policies/geotab.server.policy'),
  geotab = require('../controllers/geotab.server.controller');

module.exports = function (app) {
  // Routes collection routes
  app.route('/api/geotab').all(geotabPolicy.isAllowed)
    .get(geotab.ping);
};
