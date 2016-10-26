'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Subscriber Schema
 */
var SubscriberSchema = new Schema({
  date: {
    type: Date,
    default: new Date
  },
  email: {
    type: String,
    index: {
      unique: true
    }
  },
  name: String,
  subscribed: {
    type: Boolean,
    default: true
  }
});

mongoose.model('Subscriber', SubscriberSchema);
