(function () {
  'use strict';

  angular
    .module('routing')
    .controller('RoutesListController', RoutesListController);

  RoutesListController.$inject = ['RoutesService'];

  function RoutesListController(RoutesService) {
    var vm = this;

    vm.routes = RoutesService.query();
  }
}());
