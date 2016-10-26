'use strict';

/**
 * Module dependencies
 */
var subscribersPolicy = require('../policies/subscribers.server.policy'),
  subscribers = require('../controllers/subscribers.server.controller');

module.exports = function (app) {
  // Subscriber collection routes
  app.route('/api/subscribers').all(subscribersPolicy.isAllowed)
    .get(subscribers.list)
    .post(subscribers.create);

  // Single subscriber routes
  app.route('/api/subscribers/:subscriberId').all(subscribersPolicy.isAllowed)
    .get(subscribers.read)
    .put(subscribers.subscriber)
    .delete(subscribers.delete);

  // Finish by binding the subscriber middleware
  app.param('subscriberId', subscribers.subscriberByID);
};
