'use strict';

/**
 * Module dependencies
 */
var tracksPolicy = require('../policies/tracks.server.policy'),
  placesPolicy = require('../policies/places.server.policy'),
  fieldsPolicy = require('../policies/fields.server.policy'),
  tracks = require('../controllers/tracks.server.controller'),
  places = require('../controllers/places.server.controller'),
  fields = require('../controllers/fields.server.controller');

module.exports = function (app) {
  // Routes collection tracks
  app.route('/api/tracks').all(tracksPolicy.isAllowed)
    .get(tracks.list)
    .post(tracks.create);

  // Single track tracks
  app.route('/api/tracks/:trackId').all(tracksPolicy.isAllowed)
    .get(tracks.read)
    .put(tracks.update)
    .delete(tracks.delete);

  // Places collection tracks
  app.route('/api/places').all(placesPolicy.isAllowed)
    .get(places.list)
    .post(places.create);

  app.route('/api/places/drop').all(placesPolicy.isAllowed).get(places.drop)

  // Single place tracks
  app.route('/api/places/:placeId').all(placesPolicy.isAllowed)
    .get(places.read)
    .put(places.update)
    .delete(places.delete);

  // Fields collection tracks
  app.route('/api/fields').all(fieldsPolicy.isAllowed)
    .get(fields.list)
    .post(fields.create);

  // Single place tracks
  app.route('/api/fields/:fieldId').all(fieldsPolicy.isAllowed)
    .get(fields.read)
    .put(fields.update)
    .delete(fields.delete);

  // Bind track middleware
  app.param('trackId', tracks.trackByID);
  app.param('placeId', places.placeByID);
  app.param('fieldId', fields.fieldByID);
};
