(function () {
  'use strict';

  angular
    .module('info')
    .controller('InfoController', InfoController);

  InfoController.$inject = ['$scope', 'infoResolve', 'Authentication'];

  function InfoController($scope, info, Authentication) {
    var vm = this;

    vm.info = info;
    vm.authentication = Authentication;

  }
}());
