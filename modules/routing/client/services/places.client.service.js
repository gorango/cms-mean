(function () {
  'use strict';

  angular
    .module('routing.services')
    .factory('PlacesService', PlacesService);

  PlacesService.$inject = ['$resource', '$log'];

  function PlacesService($resource, $log) {
    var Place = $resource('/api/places/:placeId', {
      placeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Place.prototype, {
      createOrUpdate: function () {
        var place = this;
        return createOrUpdate(place);
      }
    });

    return Place;

    function createOrUpdate(place) {
      if (place._id) {
        return place.$update(onSuccess, onError);
      } else {
        return place.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(place) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
