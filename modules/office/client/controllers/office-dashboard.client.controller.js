(function () {
  'use strict';

  angular
    .module('office')
    .controller('OfficeDashboardController', OfficeDashboardController);

  OfficeDashboardController.$inject = ['$http', 'WeatherService'];

  function OfficeDashboardController($http, WeatherService) {
    var vm = this;

    WeatherService.query().$promise.then(handleWeather);

    function handleWeather(res) {
      vm.currentWeather = res[0];
    }
  }
}());
