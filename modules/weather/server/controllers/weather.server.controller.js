'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  https = require('https'),
  Weather = mongoose.model('Weather'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Get current weather
 */
function getCurrent(cb) {
  var path = '/forecast/2ab6bc66d7ddfc41330dbedf258ce699/43.63,-79.67?exclude=currently,hourly,flags,minutely&units=si';
  var options = {
    host: 'api.darksky.net',
    port: 443,
    path: path,
    method: 'GET'
  };
  var request = https.request(options, function(response) {
    var data = '';
    response.on('data', function(chunk) {
      data += chunk;
    });
    response.on('end', function() {
      // Save the weather to db.
      var weather = new Weather(JSON.parse(data));
      weather.save(function(err) {
        if (err) {
          cb({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          cb(null, weather);
        }
      });
    });
  });
  request.end();
  request.on('error', function(err) {
    cb({ message: errorHandler.getErrorMessage(err) });
  });
}

/**
 * Latest Weather
 */
exports.latest = function(req, res) {
  Weather.find().limit(1).sort('-created').exec(function(err, weather) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Limit calls to darksky to every one hour
      console.log(weather[0].created);
      if (weather[0].created.getHours() === new Date().getHours()) {
        res.json(weather);
      } else {
        getCurrent(function(error, newWeather) {
          if (!error) {
            res.json([newWeather]);
          }
        });
      }
    }
  });
};

/**
 * Show the current weather
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var weather = req.weather ? req.weather.toJSON() : {};
  res.json(weather);
};

/**
 * Update weather
 */
exports.update = function(req, res) {
  var weather = req.weather;

  weather.title = req.body.title;
  weather.content = req.body.content;

  weather.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(weather);
    }
  });
};

/**
 * Delete weather
 */
exports.delete = function(req, res) {
  var weather = req.weather;

  weather.remove(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(weather);
    }
  });
};

/**
 * Weather middleware
 */
exports.weatherByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Weather is invalid'
    });
  }

  Weather.findById(id).exec(function(err, weather) {
    if (err) {
      return next(err);
    } else if (!weather) {
      return res.status(404).send({
        message: 'No weather with that identifier has been found'
      });
    }
    req.weather = weather;
    next();
  });
};
