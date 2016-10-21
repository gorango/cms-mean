'use strict';

/**
 * Module dependencies
 */
var routesPolicy = require('../policies/routing.server.policy'),
  placesPolicy = require('../policies/places.server.policy'),
  routes = require('../controllers/routing.server.controller'),
  places = require('../controllers/places.server.controller');

module.exports = function (app) {
  // Routes collection routes
  app.route('/api/routes').all(routesPolicy.isAllowed)
    .get(routes.list)
    .post(routes.create);

  // Single route routes
  app.route('/api/routes/:routeId').all(routesPolicy.isAllowed)
    .get(routes.read)
    .put(routes.update)
    .delete(routes.delete);

  // Places collection routes
  app.route('/api/places').all(placesPolicy.isAllowed)
    .get(places.list)
    .post(places.create);

  // Single place routes
  app.route('/api/places/:placeId').all(placesPolicy.isAllowed)
    .get(places.read)
    .put(places.update)
    .delete(places.delete);

  // Bind route middleware
  app.param('routeId', routes.routeByID);
  app.param('placeId', places.placeByID);
};
