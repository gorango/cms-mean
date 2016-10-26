(function () {
  'use strict';

  angular
    .module('updates.services')
    .factory('SubscribersService', SubscribersService);

  SubscribersService.$inject = ['$resource', '$log'];

  function SubscribersService($resource, $log) {
    return $resource('/api/subscribers/:subscriberId', {
      subscriberId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
