(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$window', 'Authentication', 'menuService'];

  function HeaderController($window, Authentication, menuService) {
    var vm = this;
    var originatorEv;

    vm.authentication = Authentication;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.menu = menuService.getMenu('topbar');
    vm.year = new Date().getFullYear();
    vm.openMenu = openMenu;
    vm.signout = signout;

    function openMenu($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    }

    function signout() {
      $window.location.href = $window.location.origin + '/api/auth/signout';
    }
  }
}());
