'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  _ = require('lodash'),
  multer = require('multer'),
  request = require('request'),
  // xlsx = require('node-xlsx'), // TODO: remove
  XLSX = require('xlsx'),
  Track = mongoose.model('Track'),
  Place = mongoose.model('Place'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

function importFromFile(req, res) {
  var date = new Date();
  var destination = config.uploads.routingUpload.dest;
  var filename = '' + date.getYear().toString().slice(1) + (date.getMonth() + 1) + date.getDate() + '-import.xlsx';
  var storage = multer.diskStorage({
    destination: function(req, file, cb) { cb(null, destination); },
    filename: function(req, file, cb) { cb(null, filename); }
  });
  var upload = multer({ storage: storage }).single('routingFile');
  var fn;
  upload(req, res, function(uploadError) {
    if (!uploadError) {
      var workSheet = XLSX.readFile(`${destination}/${filename}`);
      var result = Object.keys(workSheet.Sheets).map(function(name) {
        var sheet = workSheet.Sheets[name];
        return { name, data: XLSX.utils.sheet_to_json(sheet/* , {header: 1, raw: true} */) };
      });
      var places = [];
      var failed = [];
      var sheet = result[0].data;

      fn = function cycle(i) {
        if (i === sheet.length - 1) {
          res.send({ places, failed });
        } else {
          var fields = sheet[i];
          var newFields = Object.keys(fields).reduce(function(previous, current) {
            previous[current.toLowerCase().replace(' ', '_')] = fields[current];
            return previous;
          }, {});
          fields = newFields || fields;
          setTimeout(function () {
            var place = new Place({ fields });
            var address = fields.address;
            var url = `http://maps.googleapis.com/maps/api/geocode/json?bounds=43.34,-79.98|43.98,-79.33&address=${address}&sensor=false`;
            request.get(url, function(error, response, body) {
              body = JSON.parse(body);
              if (body.status === 'OK') {
                place.address = body.results[0].formatted_address;
                place.place_id = body.results[0].place_id;
                place.location = [
                  body.results[0].geometry.location.lng,
                  body.results[0].geometry.location.lat
                ];
                place.user = req.user;
                place.save();
                places.push(place);
                cycle(++i);
              } else {
                failed.push(place);
                cycle(++i);
              }
            });
          }, 100);
        }
      };
      fn(0);
    }
  });
}

exports.importFromFile = importFromFile;
