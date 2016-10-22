'use strict';

/**
 * Module dependencies
 */
var updatesPolicy = require('../policies/updates.server.policy'),
  updates = require('../controllers/updates.server.controller');

module.exports = function (app) {
  // Updates collection routes
  app.route('/api/updates').all(updatesPolicy.isAllowed)
    .get(updates.list)
    .post(updates.create);

  // Single update routes
  app.route('/api/updates/:updateId').all(updatesPolicy.isAllowed)
    .get(updates.read)
    .put(updates.update)
    .delete(updates.delete);

  // Finish by binding the update middleware
  app.param('updateId', updates.updateByID);
};
