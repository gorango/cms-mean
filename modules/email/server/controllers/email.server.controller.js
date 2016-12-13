'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  async = require('async');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

exports.send = function (req, res, next) {
  var payload = req.body.payload;

  if ((!payload.quote && !payload.update) && !payload.template) { return res.send(400); }

  async.waterfall([
    function (done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      res.render(path.resolve('modules/email/server/templates/' + payload.template), {
        quote: payload.quote,
        update: payload.update,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML);
      });
    },
    // If valid email, send email using service
    function (emailHTML, done) {
      var mailOptions = {
        to: payload.recipient,
        from: config.mailer.from,
        bcc: payload.bcc ? [payload.bcc, 'dgtldtlng@gmail.com'] : 'dgtldtlng@gmail.com',
        subject: payload.title,
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent with confirmation.'
          });
        } else {
          return res.status(400).send({
            message: 'Failed to send email'
          });
        }
        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};
