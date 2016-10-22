(function () {
  'use strict';

  angular
    .module('updates.services')
    .factory('UpdatesService', UpdatesService);

  UpdatesService.$inject = ['$resource', '$log'];

  function UpdatesService($resource, $log) {
    return $resource('/api/updates/:updateId', {
      updateId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
