'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Geotab Schema
 */
var GeotabSchema = new Schema({
  session: {
    token: {
      type: Schema.Types.Mixed
    },
    issued: {
      type: Date,
      default: Date.now
    }
  }
});

mongoose.model('Geotab', GeotabSchema);
