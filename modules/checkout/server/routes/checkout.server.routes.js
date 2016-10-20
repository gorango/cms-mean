'use strict';

/**
 * Module dependencies
 */
var checkoutPolicy = require('../policies/checkout.server.policy'),
  checkout = require('../controllers/checkout.server.controller');

module.exports = function (app) {
  // Checkouts collection routes
  app.route('/api/checkout/create')
    .post(checkout.create);

  app.route('/api/checkout/execute')
    .post(checkout.execute);

  app.route('/api/checkout/list').all(checkoutPolicy.isAllowed)
    .post(checkout.list);
};
