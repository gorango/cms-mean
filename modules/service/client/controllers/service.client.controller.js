(function () {
  'use strict';

  angular
    .module('service')
    .controller('ServiceController', ServiceController);

  ServiceController.$inject = ['localStorageService', '$scope', 'MAP_CONFIG', 'SERVICE_AREA_STYLES', 'OUTER_SERVICE_AREA_COORDS', 'INNER_SERVICE_AREA_COORDS'];

  function ServiceController(localStorage, $scope, MAP_CONFIG, SERVICE_AREA_STYLES, OUTER_SERVICE_AREA_COORDS, INNER_SERVICE_AREA_COORDS) {
    var vm = this;

    vm.map = MAP_CONFIG;
    vm.polygons = [_.merge(SERVICE_AREA_STYLES, { path: INNER_SERVICE_AREA_COORDS })];

    $scope.$on('$stateChangeSuccess', _getQuote);

    function _getQuote() {
      vm.quote = localStorage.get('quote') || {};
    }

  }
}());
