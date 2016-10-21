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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  location: {
    type: [Number],
    required: true,
    index: '2dsphere'
  }, // [lng, lat]
  title: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  fields: [{
    heading: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  }],
  route: {
    order: {
      type: Number,
      default: -1
    },
    title: {
      type: String,
      default: ''
    }
  }
});

PlaceSchema.pre('save', function(next) {
  this.updated = new Date();
  next();
});

mongoose.model('Place', PlaceSchema);
