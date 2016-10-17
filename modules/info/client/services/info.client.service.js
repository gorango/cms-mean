(function () {
  'use strict';

  angular
    .module('info.services')
    .factory('InfoService', InfoService);

  InfoService.$inject = ['$resource', '$log'];

  function InfoService($resource, $log) {
    var Info = $resource('/api/info/:infoId', {
      infoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Info.prototype, {
      createOrUpdate: function () {
        var info = this;
        return createOrUpdate(info);
      }
    });

    return Info;

    function createOrUpdate(info) {
      if (info._id) {
        return info.$update(onSuccess, onError);
      } else {
        return info.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(info) {
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
