(function() {
  'use strict';

  angular
    .module('core')
    .factory('GeoService', GeoService);

  GeoService.$inject = (['$q', '$http', 'uiGmapGoogleMapApi', 'SERVICE_AREA_BOUNDS']);

  function GeoService($q, $http, uiGmapGoogleMapApi, SERVICE_AREA_BOUNDS) {
    var gmapsService;
    uiGmapGoogleMapApi.then(function(map, x) {
      gmapsService = new google.maps.places.AutocompleteService();
    });

    return {
      geocode: function(address) {
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?sensor=false&place_id=' + address.place_id + '&key=AIzaSyCw8afM0SzdyOsDysY_k_eDzTwunNH2-NY';
        return $http.get(url);
      },
      searchAddress: function (address) {
        var deferred = $q.defer();
        if (address.length > 2) {
          _getSearchResults(address)
            .then(function(predictions) {
              if (!predictions) { deferred.reject(); }
              var results = [];
              for (var i = 0; i < predictions.length - 1; i++) {
                results.push(predictions[i]);
              }
              deferred.resolve(results);
            });
        } else { deferred.reject(); }
        return deferred.promise;
      },
      isInsideServiceArea(location) {
        var serviceArea = new google.maps.Polygon({ paths: SERVICE_AREA_BOUNDS });
        var latLng = new google.maps.LatLng(location);
        return google.maps.geometry.poly.containsLocation(latLng, serviceArea);
      }
    };

    function _getSearchResults(address) {
      var deferred = $q.defer();
      var options = { input: address, componentRestrictions: { country: 'ca' } };
      gmapsService.getPlacePredictions(options, function(data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    }
  }
}());
