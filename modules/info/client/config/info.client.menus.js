(function () {
  'use strict';

  angular
    .module('info')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Info',
      state: 'info',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'info', {
      title: 'List Info',
      state: 'info.list',
      roles: ['*']
    });
  }
}());
