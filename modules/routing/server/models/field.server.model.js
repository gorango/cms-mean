'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Field Schema
 */
var FieldSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  value: {
    type: String,
    index: {
      unique: true
    }
  },
  address: Boolean
});

mongoose.model('Field', FieldSchema);
