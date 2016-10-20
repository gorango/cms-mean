'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  config = require(path.resolve('./config/config')),
  paypal = require('paypal-rest-sdk'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

paypal.configure({
  mode: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

exports.list = function(req, res) {
  paypal.payment.list(function(error, payment) {
    if (error) {
      res.send(error);
    } else {
      res.json(payment);
    }
  });
};

exports.create = function(req, res) {
  if (!req.body) {
    res.send('No payment obj.');
  }
  paypal.payment.create(req.body, function(error, payment) {
    if (error) {
      res.send(error.response);
    } else {
      var redirectUrl;
      for (var index = 0; index < payment.links.length; index++) {
        if (payment.links[index].rel === 'approval_url') {
          redirectUrl = payment.links[index].href;
        }
      }
      res.send(redirectUrl);
    }
  });
};

exports.execute = function(req, res) {
  var paymentId = req.body.paymentId;
  var executePayment = req.body.executePayment;
  paypal.payment.execute(paymentId, executePayment, function(error, payment) {
    if (error) {
      res.send(error.response);
    } else {
      res.json(payment);
    }
  });
};
