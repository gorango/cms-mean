'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Update = mongoose.model('Update'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an update
 */
exports.create = function (req, res) {
  var update = new Update(req.body);
  update.user = req.user;

  update.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(update);
    }
  });
};

/**
 * Show the current update
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var update = req.update ? req.update.toJSON() : {};

  res.json(update);
};

/**
 * Update an update
 */
exports.update = function (req, res) {
  var update = req.update;

  update.date = req.body.date;
  update.content = req.body.content;
  update.link = req.body.link;
  update.weather = req.body.weather;

  update.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(update);
    }
  });
};

/**
 * Delete an update
 */
exports.delete = function (req, res) {
  var update = req.update;

  update.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(update);
    }
  });
};

/**
 * List of Updates
 */
exports.list = function (req, res) {
  Update.find().sort('-date').populate('user', 'displayName').exec(function (err, updates) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(updates);
    }
  });
};

/**
 * Update middleware
 */
exports.updateByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Update is invalid'
    });
  }

  Update.findById(id).populate('user', 'displayName').exec(function (err, update) {
    if (err) {
      return next(err);
    } else if (!update) {
      return res.status(404).send({
        message: 'No update with that identifier has been found'
      });
    }
    req.update = update;
    next();
  });
};
