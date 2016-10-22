(function () {
  'use strict';

  angular
    .module('office')
    .controller('OfficeDashboardController', OfficeDashboardController);

  OfficeDashboardController.$inject = ['$http'];

  function OfficeDashboardController($http) {
    var vm = this;

    $http.get('/api/current-weather').then(handleWeather);

    function handleWeather(res) {
      vm.currentWeather = JSON.parse(res.data);
    }
  }
}());
