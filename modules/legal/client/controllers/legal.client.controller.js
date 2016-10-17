(function () {
  'use strict';

  angular
    .module('legal')
    .controller('LegalController', LegalController);

  LegalController.$inject = [];

  function LegalController() {
    var vm = this;

    vm.serviceYear = new Date().getFullYear() - (new Date().getMonth() < 4 ? 1 : 0);
  }
}());
