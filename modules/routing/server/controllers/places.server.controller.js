'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Place = mongoose.model('Place'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an place
 */
exports.create = function(req, res) {
  var place = new Place(req.body);
  place.user = req.user;

  place.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(place);
    }
  });
};

/**
 * Show the current place
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var place = req.place ? req.place.toJSON() : {};

  // Add a custom field to the Place, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Place model.
  place.isCurrentUserOwner = !!(req.user && place.user && place.user._id.toString() === req.user._id.toString());

  res.json(place);
};

/**
 * Update an place
 */
exports.update = function(req, res) {
  var place = req.place;

  place.title = req.body.title;
  place.content = req.body.content;

  place.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(place);
    }
  });
};

/**
 * Delete an place
 */
exports.delete = function(req, res) {
  var place = req.place;

  place.remove(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(place);
    }
  });
};

/**
 * List of Places
 */
exports.list = function(req, res) {
  Place.find().sort('-created').populate('user', 'displayName').exec(function(err, places) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(places);
    }
  });
};

/**
 * Place middleware
 */
exports.placeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Place is invalid'
    });
  }

  Place.findById(id).populate('user', 'displayName').exec(function(err, place) {
    if (err) {
      return next(err);
    } else if (!place) {
      return res.status(404).send({
        message: 'No place with that identifier has been found'
      });
    }
    req.place = place;
    next();
  });
};
