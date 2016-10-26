var request = require('request');

exports.geocode = function(address, cb) {
  var url = `http://maps.googleapis.com/maps/api/geocode/json?bounds=43.34,-79.98|43.98,-79.33&address=${address}&sensor=false`;
  request.get(url, function(error, response, body) {
    if (body.status === 'OK') {
      cb(response.results[0]);
    }
  });
};
