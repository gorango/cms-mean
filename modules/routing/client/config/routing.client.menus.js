(function () {
  'use strict';

  angular
    .module('routing')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Routes',
      state: 'routing',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'routing', {
      title: 'List Routes',
      state: 'routing.list',
      roles: ['*']
    });
  }
}());
