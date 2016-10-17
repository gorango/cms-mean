(function () {
  'use strict';

  angular
    .module('service')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Service',
      state: 'service',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'service', {
      title: 'List Service',
      state: 'service.list',
      roles: ['*']
    });
  }
}());
