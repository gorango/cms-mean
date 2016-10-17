(function () {
  'use strict';

  // Configuring the Quotes Admin module
  angular
    .module('quotes.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Quotes',
      state: 'admin.quotes.list'
    });
  }
}());
