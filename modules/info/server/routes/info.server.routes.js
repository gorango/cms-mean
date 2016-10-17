'use strict';

/**
 * Module dependencies
 */
var infoPolicy = require('../policies/info.server.policy'),
  info = require('../controllers/info.server.controller');

module.exports = function (app) {
  // Info collection routes
  app.route('/api/info').all(infoPolicy.isAllowed)
    .get(info.list)
    .post(info.create);

  // Single info routes
  app.route('/api/info/:infoId').all(infoPolicy.isAllowed)
    .get(info.read)
    .put(info.update)
    .delete(info.delete);

  // Finish by binding the info middleware
  app.param('infoId', info.infoByID);
};
