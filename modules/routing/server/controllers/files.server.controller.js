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
  Route = mongoose.model('Route'),
  Place = mongoose.model('Place'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.import = function(req, res) {
  var date = new Date();
  var destination = config.uploads.routingUpload.dest;
  var filename = '' + date.getYear().toString().slice(1) + (date.getMonth() + 1) + date.getDate() + '-import.xlsx';
  var storage = multer.diskStorage({
    destination: function(req, file, cb) { cb(null, destination); },
    filename: function(req, file, cb) { cb(null, filename); }
  });
  var upload = multer({ storage: storage }).single('routingFile');

  upload(req, res, function(uploadError) {
    if (!uploadError) {
      var workSheet = XLSX.readFile(`${destination}/${filename}`);
      var result = Object.keys(workSheet.Sheets).map(function(name) {
        var sheet = workSheet.Sheets[name];
        return { name, data: XLSX.utils.sheet_to_json(sheet/* , {header: 1, raw: true} */) };
      });
      result[0].data.forEach(function(fields, i) {
        fields = _.forEach(fields, (v, k) => { k = k.toLowerCase().split(' ').join('_'); });
        // console.log(fields);
        // if (i === 10) {
        //   geocode(fields['Address'], function(res) {
        //     console.log(res);
        //   });
        // }
        var place = new Place({ fields });
        place.user = req.user;
        place.save();
      });
      setTimeout(function () {
        res.send('cool');
      }, 3000);
      // res.json(places);
    }
  });
};
