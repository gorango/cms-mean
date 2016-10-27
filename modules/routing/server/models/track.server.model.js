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
  places: [{
    type: Schema.ObjectId,
    ref: 'Place'
  }]
});

TrackSchema.pre('save', function(next) {
  this.updated = new Date();
  next();
});

mongoose.model('Track', TrackSchema);
