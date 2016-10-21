'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Route Schema
 */
var RouteSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  markers: [{
    type: Schema.ObjectId,
    ref: 'Marker'
  }],
  directions: [{
    segment: Number,
    points: [{
      lat: Number,
      lng: Number
    }]
  }]
});

RouteSchema.pre('save', function(next) {
  this.updated = new Date();
  next();
});

mongoose.model('Route', RouteSchema);
