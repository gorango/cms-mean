(function () {
  'use strict';

  // Configuring the Info Admin module
  angular
    .module('info.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Info',
      state: 'admin.info.list'
    });
  }
}());
