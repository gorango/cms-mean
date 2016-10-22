'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Weather Schema
 */
var WeatherSchema = new Schema({
  created: {
    type: Date,
    default: new Date
  },
  latitude: Number,
  longitude: Number,
  timezone: String,
  offset: Number,
  daily: {
    summary: String,
    icon: String,
    data: [Schema.Types.Mixed]
  }
});

mongoose.model('Weather', WeatherSchema);
