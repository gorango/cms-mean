(function () {
  'use strict';

  angular
    .module('legal')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Service',
      state: 'legal',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'legal', {
      title: 'List Service',
      state: 'legal.list',
      roles: ['*']
    });
  }
}());
