'use strict';

/**
 * Module dependencies
 */
var weatherPolicy = require('../policies/weather.server.policy'),
  weather = require('../controllers/weather.server.controller');

module.exports = function (app) {
  // Info collection routes
  app.route('/api/weather').all(weatherPolicy.isAllowed)
    .get(weather.latest);

  // Single weather routes
  app.route('/api/weather/:weatherId').all(weatherPolicy.isAllowed)
    .get(weather.read)
    .put(weather.update)
    .delete(weather.delete);

  // Finish by binding the weather middleware
  app.param('weatherId', weather.weatherByID);
};
