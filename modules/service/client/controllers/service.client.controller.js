(function () {
  'use strict';

  angular
    .module('service')
    .controller('ServiceController', ServiceController);

  ServiceController.$inject = ['localStorageService', '$scope'];

  function ServiceController(localStorage, $scope) {
    var vm = this;
  }
}());
