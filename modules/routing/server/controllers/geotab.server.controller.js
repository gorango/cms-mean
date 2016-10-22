'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Route = mongoose.model('Route'),
  Place = mongoose.model('Place'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.ping = function (req, res) {
  console.log('pong');
  res.send('pong');
};
