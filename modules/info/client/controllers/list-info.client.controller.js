(function () {
  'use strict';

  angular
    .module('info')
    .controller('InfoListController', InfoListController);

  InfoListController.$inject = ['InfoService'];

  function InfoListController(InfoService) {
    var vm = this;

    vm.info = InfoService.query();
  }
}());
