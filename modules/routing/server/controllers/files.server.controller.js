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
  xlsx = require('node-xlsx'),
  XLSX = require('xlsx'),
  XMLWriter = require('xml-writer'),
  Track = mongoose.model('Track'),
  Place = mongoose.model('Place'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.importFromFile = function(req, res) {
  var date = new Date();
  var destination = config.uploads.routingUpload.dest;
  var filename = '' + date.getYear().toString().slice(1) + (date.getMonth() + 1) + date.getDate() + '-import.xlsx';
  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, destination);
    },
    filename: function(req, file, cb) {
      cb(null, filename);
    }
  });
  var upload = multer({
    storage: storage
  }).single('routingFile');
  var fn;
  upload(req, res, function(uploadError) {
    if (!uploadError) {
      var workSheet = XLSX.readFile(`${destination}/${filename}`);
      var result = Object.keys(workSheet.Sheets).map(function(name) {
        var sheet = workSheet.Sheets[name];
        return {
          name,
          // data: XLSX.utils.sheet_to_json(sheet, {header: 1, raw: true}  )
          data: XLSX.utils.sheet_to_json(sheet)
        };
      });
      var places = [];
      var failed = [];
      var sheet = result[0].data;

      fn = function cycle(i) {
        if (i === sheet.length - 1) {
          res.send({
            places,
            failed
          });
        } else {
          var fields = sheet[i];
          var newFields = Object.keys(fields).reduce(function(previous, current) {
            previous[current] = fields[current];
            return previous;
          }, {});
          fields = newFields || fields;
          setTimeout(function() {
            var place = new Place({
              fields
            });
            var address = fields[Object.keys(fields).filter(key => key.toLowerCase().indexOf('address') > -1)];
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
          }, 50);
        }
      };
      fn(0);
    }
  });
};

exports.finishUpload = function(req, res) {

};

/**
 * Track middleware
 */
exports.exportFile = function(req, res) {
  var type = req.query.type;
  switch (type) {
    case 'excel':
      return downloadExcel(res);
    case 'garmin':
      return Place.find().exec(function(err, places) {
        return downloadXML(res, places);
      });
    case 'geotab':
      break;
    default:
      return res.status(422).send({
        message: 'poop'
      });
  }
};

function downloadExcel(res) {
  Track.find().sort('-created').populate('places').exec(function(err, tracks) {
    if (!err) {
      let build = [];
      tracks.forEach(track => {
        if (track.places.length) {
          let places = track.places.map(place => {
            var fields = [];
            for (var key in place.fields) {
              if (place.fields[key]) {
                fields.push(place.fields[key]);
              }
            }
            return fields;
            // return Object.keys(place.fields).map(field => place.fields[field]);
          });
          places.splice(0, 0, Object.keys(track.places[0].fields));
          build.push({
            name: track.title,
            data: places
          });
        }
      });
      var buffer = xlsx.build(build);
      var path = `./modules/routing/client/uploads/${new Date().getFullYear().toString().slice(2)}${(new Date().getMonth() + 1)}${new Date().getDate()}routes.xlsx`;
      var wstream = fs.createWriteStream(path);
      wstream.write(buffer);
      wstream.end();
      wstream.on('finish', function() {
        console.log('file has been written');
        res.send(path);
      });
    }
  });
}

function downloadXML(res, points) {
  var xw = new XMLWriter;
  xw.startDocument();
  xw.startElement('gpx');
  xw.writeAttribute('xmlns', 'http://www.topografix.com/GPX/1/1');
  xw.writeAttribute('creator', 'MapSource 6.16.3');
  xw.writeAttribute('version', '1.1');
  xw.writeAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
  xw.writeAttribute('xsi:schemaLocation', 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd');

  xw.writeComment(' ');

  xw.startElement('metadata');
  xw.startElement('link');
  xw.writeAttribute('href', 'http://www.garmin.com');
  xw.writeElement('text', 'Garmin International');
  xw.endElement();
  xw.writeElement('time', '2015-11-27T22:39:33Z');
  xw.endElement();

  _.forEach(points, function(point, index) {
    if (point.location) {
      xw.writeComment(point.address);
      xw.startElement('wpt');
      xw.writeAttribute('lat', point.location[1]);
      xw.writeAttribute('lon', point.location[0]);
      xw.writeElement('name', point.address);
      // xw.writeElement('desc', point.address);
      xw.writeElement('sym', 'Flag, Blue');
      xw.startElement('extensions');
      xw.startElement('gpxx:WaypointExtension');
      xw.writeAttribute('xmlns:gpxx', 'http://www.garmin.com/xmlschemas/GpxExtensions/v3');
      xw.writeElement('gpxx:DisplayMode', 'SymbolAndName');
      xw.endElement();
      xw.endElement();
      xw.endElement();
    }
  });

  xw.endElement();
  xw.endDocument();

  var path = `./modules/routing/client/uploads/${new Date().getFullYear().toString().slice(2)}${(new Date().getMonth() + 1)}${new Date().getDate()}locations.xml`;
  fs.writeFile(path, xw.toString(), function(err, result) {
    console.log('saved');
    res.send(path);
  });
}
