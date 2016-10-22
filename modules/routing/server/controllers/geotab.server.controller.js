'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  request = require('request'),
  Geotab = mongoose.model('Geotab'),
  Route = mongoose.model('Route'),
  Place = mongoose.model('Place'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.ping = function(req, res) {
  res.send('pong');
};

exports.getSesssionToken = function(req, res) {
  // The sesssion token from Geotab lasts two weeks.
  // Store in db when issued, along with date.
  // Check for existence of token, and date validity
  Geotab.findOne().exec(function(err, geotab) {
    if (!err) {
      console.log(geotab);
    }
  });

  var url = buildBaseURL();

  request
    .get(buildBaseURL(), function(err, result) {
      if (!err) {
        var geotab = new Geotab({ session: result.body });
        res.json(result.body);
      }
    });

  function buildBaseURL() {
    var baseUrl = process.env.GEOTAB_URL;
    var database = process.env.GEOTAB_DB;
    var userName = process.env.GEOTAB_USER;
    var password = process.env.GEOTAB_PASS;
    return baseUrl + '/apiv1/Authenticate?database=' + database + '&userName=' + userName + '&password=' + password;
  }
};
