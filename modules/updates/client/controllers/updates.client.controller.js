(function () {
  'use strict';

  angular
    .module('updates')
    .controller('UpdatesController', UpdatesController);

  UpdatesController.$inject = ['$sce', '$http', 'UpdatesService', 'WeatherService', 'Authentication'];

  function UpdatesController($sce, $http, UpdatesService, WeatherService, Authentication) {
    var vm = this;

    vm.authentication = Authentication;

    init();

    function init() {
      UpdatesService.query().$promise.then(handleUpdates);
      WeatherService.query().$promise.then(handleWeather);
    }

    function handleUpdates(updates) {
      angular.forEach(updates, function(update) {
        update.content = $sce.trustAsHtml(update.content);
        if (update.link) {
          update.link = $sce.trustAsHtml(update.link);
        }
      });
      vm.updates = updates;
      // TODO: Add pagination and infinite scroll
    }

    function handleWeather(res) {
      vm.currentWeather = res[0];
    }
  }
}());
