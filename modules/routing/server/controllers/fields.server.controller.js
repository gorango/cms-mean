'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Field = mongoose.model('Field'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a field
 */
exports.create = function(req, res) {
  var field = new Field(req.body);

  field.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(field);
    }
  });
};

/**
 * Show the current field
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var field = req.field ? req.field.toJSON() : {};

  res.json(field);
};

/**
 * Update a field
 */
exports.update = function(req, res) {
  var field = req.field;

  field.value = req.body.value;
  field.address = req.body.address;

  field.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(field);
    }
  });
};

/**
 * Delete a field
 */
exports.delete = function(req, res) {
  var field = req.field;

  field.remove(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(field);
    }
  });
};

/**
 * List of Places
 */
exports.list = function(req, res) {
  Field.find().sort('-created').exec(function(err, fields) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(fields);
    }
  });
};

/**
 * Field middleware
 */
exports.fieldByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Field is invalid'
    });
  }

  Field.findById(id).exec(function(err, field) {
    if (err) {
      return next(err);
    } else if (!field) {
      return res.status(404).send({
        message: 'No field with that identifier has been found'
      });
    }
    req.field = field;
    next();
  });
};
