'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  https = require('https'),
  Info = mongoose.model('Info'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Get current weather
 */
exports.weather = function (req, res) {
  var path = '/forecast/2ab6bc66d7ddfc41330dbedf258ce699/43.63,-79.67?exclude=currently,hourly,flags,minutely&units=si';
  var options = {
    host: 'api.darksky.net',
    port: 443,
    path: path,
    method: 'GET'
  };
  var request = https.request(options, function(response) {
    var data = '';
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function () {
      res.json(data);
    });
  });
  request.end();
  request.on('error', function(err) {
    return res.status(500).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Create an info
 */
exports.create = function (req, res) {
  var info = new Info(req.body);
  info.user = req.user;

  info.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(info);
    }
  });
};

/**
 * Show the current info
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var info = req.info ? req.info.toJSON() : {};

  // Add a custom field to the Info, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Info model.
  info.isCurrentUserOwner = !!(req.user && info.user && info.user._id.toString() === req.user._id.toString());

  res.json(info);
};

/**
 * Update an info
 */
exports.update = function (req, res) {
  var info = req.info;

  info.title = req.body.title;
  info.content = req.body.content;

  info.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(info);
    }
  });
};

/**
 * Delete an info
 */
exports.delete = function (req, res) {
  var info = req.info;

  info.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(info);
    }
  });
};

/**
 * List of Info
 */
exports.list = function (req, res) {
  Info.find().sort('-created').populate('user', 'displayName').exec(function (err, info) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(info);
    }
  });
};

/**
 * Info middleware
 */
exports.infoByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Info is invalid'
    });
  }

  Info.findById(id).populate('user', 'displayName').exec(function (err, info) {
    if (err) {
      return next(err);
    } else if (!info) {
      return res.status(404).send({
        message: 'No info with that identifier has been found'
      });
    }
    req.info = info;
    next();
  });
};
