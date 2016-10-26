'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Track = mongoose.model('Track'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a track
 */
exports.create = function(req, res) {
  var track = new Track(req.body);

  track.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(track);
    }
  });
};

/**
 * Show the current track
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var track = req.track ? req.track.toJSON() : {};

  res.json(track);
};

/**
 * Update a track
 */
exports.update = function(req, res) {
  var track = req.track;

  track.value = req.body.value;
  track.address = req.body.address;

  track.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(track);
    }
  });
};

/**
 * Delete a track
 */
exports.delete = function(req, res) {
  var track = req.track;

  track.remove(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(track);
    }
  });
};

/**
 * List of Tracks
 */
exports.list = function(req, res) {
  Track.find().sort('-created').exec(function(err, tracks) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tracks);
    }
  });
};

/**
 * Track middleware
 */
exports.trackByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Track is invalid'
    });
  }

  Track.findById(id).exec(function(err, track) {
    if (err) {
      return next(err);
    } else if (!track) {
      return res.status(404).send({
        message: 'No track with that identifier has been found'
      });
    }
    req.track = track;
    next();
  });
};
