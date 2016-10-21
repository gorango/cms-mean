(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['Authentication', 'menuService'];

  function HeaderController(Authentication, menuService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.menu = menuService.getMenu('topbar');
    vm.year = new Date().getFullYear();
  }
}());
