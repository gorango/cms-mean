(function () {
  'use strict';

  angular
    .module('routing')
    .controller('RoutingController', RoutingController);

  RoutingController.$inject = ['$scope', 'RoutingService', 'Authentication'];

  function RoutingController($scope, RoutingService, Authentication) {
    var vm = this;

    vm.routes = RoutingService.query();
    vm.authentication = Authentication;

  }
}());
