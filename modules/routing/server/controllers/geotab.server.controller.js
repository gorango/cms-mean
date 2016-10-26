'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  request = require('request'),
  Geotab = mongoose.model('Geotab'),
  Track = mongoose.model('Track'),
  Place = mongoose.model('Place'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var auth = {
  url: process.env.GEOTAB_URL,
  db: process.env.GEOTAB_DB,
  user: process.env.GEOTAB_USER,
  pass: process.env.GEOTAB_PASS
};


exports.ping = function(req, res) {
  res.send('pong');
};

function getSesssionToken() {
  // The sesssion token from Geotab lasts two weeks.
  // Store in db when issued, along with date.
  // Check for existence of token, and date validity
  return new Promise(function(resolve, reject) {
    var url = `${auth.url}/apiv1/Authenticate?database=${auth.db}&userName=${auth.user}&password=${auth.pass}`;
    request.get(url, function(err, result) {
      if (!err) {
        var geotab = new Geotab({
          token: result.body
        });
        console.log('creating new');
        console.log(result.body);
        geotab.save(function(err) {
          if (!err) {
            resolve(geotab);
          }
        });
      } else {
        console.log('request error');
        reject('can\t save');
      }
    });
  });
}

function makeAuthRequest(geotab) {
  console.log(geotab);
  var credentials = { database: auth.db, userName: auth.user, sessionId: geotab.sessionId };
  var url = `${auth.url}/apiv1/Authenticate?database=${auth.db}&userName=${auth.user}&sessionId=${geotab.sessionId}`;
  // var url = `${auth.url}/apiv1/typeName=${type}?credentials=${JSON.stringify(credentials)}`;
  return new Promise(function(resolve, reject) {
    request.get(url, function(err, result) {
      if (!err) {
        resolve(result);
      }
    });
  });
}

exports.authenticate = function(req, res) {
  Geotab.find().limit(1).sort('-issued').exec(function(err, session) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (session.length && session[0].issued) {
        console.log('authenticating with existing token');
        // The sesssion token from Geotab lasts two weeks.
        var sessionValid = ((Date.now() - session[0].issued) / 1000 / 60 / 60 / 24) < 14;
        if (sessionValid) {
          makeAuthRequest(session)
            .then(res.json);
        }
      } else {
        console.log('getting new token');
        getSesssionToken()
          .then(makeAuthRequest)
          .then(res.json);
      }
    }
  });
};
