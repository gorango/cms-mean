'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Subscriber = mongoose.model('Subscriber'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an subscriber
 */
exports.create = function (req, res) {
  var subscriber = new Subscriber(req.body);

  subscriber.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subscriber);
    }
  });
};

/**
 * Show the current subscriber
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var subscriber = req.subscriber ? req.subscriber.toJSON() : {};

  res.json(subscriber);
};

/**
 * Subscriber an subscriber
 */
exports.subscriber = function (req, res) {
  var subscriber = req.subscriber;

  subscriber.date = req.body.date;
  subscriber.content = req.body.content;
  subscriber.link = req.body.link;
  subscriber.weather = req.body.weather;

  subscriber.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subscriber);
    }
  });
};

/**
 * Delete an subscriber
 */
exports.delete = function (req, res) {
  var subscriber = req.subscriber;

  subscriber.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subscriber);
    }
  });
};

/**
 * List of Subscribers
 */
exports.list = function (req, res) {
  Subscriber.find().sort('-date').exec(function (err, subscribers) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subscribers);
    }
  });
};

/**
 * Subscriber middleware
 */
exports.subscriberByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Subscriber is invalid'
    });
  }

  Subscriber.findById(id).exec(function (err, subscriber) {
    if (err) {
      return next(err);
    } else if (!subscriber) {
      return res.status(404).send({
        message: 'No subscriber with that identifier has been found'
      });
    }
    req.subscriber = subscriber;
    next();
  });
};
