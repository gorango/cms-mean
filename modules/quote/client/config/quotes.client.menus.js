(function () {
  'use strict';

  angular
    .module('quotes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Quotes',
      state: 'quotes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'quotes', {
      title: 'List Quotes',
      state: 'quotes.list',
      roles: ['*']
    });
  }
}());
