(function () {
  'use strict';

  angular
    .module('office')
    .controller('OfficeController', OfficeController);

  OfficeController.$inject = ['$scope', 'Authentication', '$mdSidenav'];

  function OfficeController($scope, Authentication, $mdSidenav) {
    var vm = this;

    vm.authentication = Authentication;
  }
}());
