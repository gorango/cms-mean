(function () {
  'use strict';

  angular
    .module('routing.services')
    .factory('RoutesService', RoutesService);

  RoutesService.$inject = ['$resource', '$log'];

  function RoutesService($resource, $log) {
    return $resource('/api/tracks/:trackId', {
      trackId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
