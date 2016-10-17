(function () {
  'use strict';

  angular
    .module('info.admin')
    .controller('InfoAdminListController', InfoAdminListController);

  InfoAdminListController.$inject = ['InfoService'];

  function InfoAdminListController(InfoService) {
    var vm = this;

    vm.info = InfoService.query();
  }
}());
