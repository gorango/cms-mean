(function () {
  'use strict';

  angular
    .module('updates')
    .controller('UpdatesController', UpdatesController);

  UpdatesController.$inject = ['$sce', '$http', 'UpdatesService', 'Authentication'];

  function UpdatesController($sce, $http, UpdatesService, Authentication) {
    var vm = this;

    vm.authentication = Authentication;

    UpdatesService.query().$promise.then(handleUpdates);

    $http.get('/api/current-weather').then(handleWeather);

    function handleUpdates(updates) {
      angular.forEach(updates, function(update) {
        update.content = $sce.trustAsHtml(update.content);
        if (update.link) {
          update.link = $sce.trustAsHtml(update.link);
        }
      });
      vm.updates = updates.slice(updates.length - 50);
    }

    function handleWeather(res) {
      vm.currentWeather = JSON.parse(res.data);
    }
  }
}());
