'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Place Schema
 */
var PlaceSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  location: {
    type: [Number], // [lng, lat]
    index: '2dsphere'
  },
  place_id: String,
  address: {
    type: String,
    index: {
      unique: true
    }
  },
  fields: {
    type: Schema.Types.Mixed
  }
});

PlaceSchema.pre('save', function(next) {
  this.updated = new Date();
  next();
});

mongoose.model('Place', PlaceSchema);
