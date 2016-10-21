(function () {
  'use strict';

  angular
    .module('office')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Office',
      state: 'office',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'office', {
      title: 'Office Dashboard',
      state: 'office.dashboard',
      roles: ['*']
    });
  }
}());
