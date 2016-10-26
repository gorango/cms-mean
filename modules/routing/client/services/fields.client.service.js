(function () {
  'use strict';

  angular
    .module('routing.services')
    .factory('FieldsService', FieldsService);

  FieldsService.$inject = ['$resource', '$log'];

  function FieldsService($resource, $log) {
    return $resource('/api/fields/:fieldId', {
      fieldId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
