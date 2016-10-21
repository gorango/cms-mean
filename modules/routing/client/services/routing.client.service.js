(function () {
  'use strict';

  angular
    .module('routing.services')
    .factory('RoutingService', RoutingService);

  RoutingService.$inject = ['$resource', '$log'];

  function RoutingService($resource, $log) {
    var Route = $resource('/api/routes/:routeId', {
      routeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Route.prototype, {
      createOrUpdate: function () {
        var route = this;
        return createOrUpdate(route);
      }
    });

    return Route;

    function createOrUpdate(route) {
      if (route._id) {
        return route.$update(onSuccess, onError);
      } else {
        return route.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(route) {
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
