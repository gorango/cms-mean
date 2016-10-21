(function () {
  'use strict';

  angular
    .module('office')
    .controller('OfficeController', OfficeController);

  OfficeController.$inject = ['$scope', 'Authentication', '$mdSidenav'];

  function OfficeController($scope, Authentication, $mdSidenav) {
    var vm = this;

    vm.authentication = Authentication;
    vm.toggleSidenav = toggleSidenav;
    vm.closeSidenav = closeSidenav;

    $scope.$on('$stateChangeStart', closeSidenav);

    function toggleSidenav() {
      $mdSidenav('sidenav')
        .toggle();
        // .then(function () {});
    }

    function closeSidenav() {
      $mdSidenav('sidenav')
        .close();
    }
  }
}());
