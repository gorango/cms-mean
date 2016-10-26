'use strict';

/**
 * Module dependencies
 */
var geotabPolicy = require('../policies/geotab.server.policy'),
  geotab = require('../controllers/geotab.server.controller');

module.exports = function (app) {
  app.route('/api/geotab').all(geotabPolicy.isAllowed)
    .get(geotab.ping);

  app.route('/api/geotab/auth').all(geotabPolicy.isAllowed)
    .get(geotab.authenticate);
};
