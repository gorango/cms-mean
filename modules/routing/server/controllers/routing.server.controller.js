'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Route = mongoose.model('Route'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an route
 */
exports.create = function (req, res) {
  var route = new Route(req.body);
  route.user = req.user;

  route.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(route);
    }
  });
};

/**
 * Show the current route
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var route = req.route ? req.route.toJSON() : {};

  // Add a custom field to the Route, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Route model.
  route.isCurrentUserOwner = !!(req.user && route.user && route.user._id.toString() === req.user._id.toString());

  res.json(route);
};

/**
 * Update an route
 */
exports.update = function (req, res) {
  var route = req.route;

  route.title = req.body.title;
  route.content = req.body.content;

  route.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(route);
    }
  });
};

/**
 * Delete an route
 */
exports.delete = function (req, res) {
  var route = req.route;

  route.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(route);
    }
  });
};

/**
 * List of Routes
 */
exports.list = function (req, res) {
  Route.find().sort('-created').populate('places').exec(function (err, routes) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(routes);
    }
  });
};

/**
 * Route middleware
 */
exports.routeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Route is invalid'
    });
  }

  Route.findById(id).populate('places').exec(function (err, route) {
    if (err) {
      return next(err);
    } else if (!route) {
      return res.status(404).send({
        message: 'No route with that identifier has been found'
      });
    }
    req.route = route;
    next();
  });
};
