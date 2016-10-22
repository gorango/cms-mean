'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Update Schema
 */
var UpdateSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  weather: {
    latitude: Number,
    longitude: Number,
    timezone: String,
    daily: {
      data: [{
        type: Schema.Types.Mixed
      }]
    }
  }
});

mongoose.model('Update', UpdateSchema);
