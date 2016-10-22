(function () {
  'use strict';

  angular
    .module('weather.services')
    .factory('WeatherService', WeatherService);

  WeatherService.$inject = ['$resource', '$log'];

  function WeatherService($resource, $log) {
    return $resource('/api/weather/:weatherId', {
      weatherId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
