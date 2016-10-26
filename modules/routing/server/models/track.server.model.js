'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Track Schema
 */
var TrackSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    trim: true,
    required: 'Title cannot be blank',
    index: {
      unique: true
    }
  },
  places: [Schema.Types.Mixed],
  directions: [{
    segment: Number,
    points: [{
      lat: Number,
      lng: Number
    }]
  }]
});

TrackSchema.pre('save', function(next) {
  this.updated = new Date();
  next();
});

mongoose.model('Track', TrackSchema);
