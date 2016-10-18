(function() {
  'use strict';

  angular
    .module('info')
    .controller('InfoController', InfoController);

  InfoController.$inject = ['$http', '$sce', '$timeout'];

  function InfoController($http, $sce, $timeout) {
    var vm = this;

    vm.updates;
    vm.today = new Date();

    $http.get('/service-updates.json').then(handleUpdates);

    $http.get('/api/current-weather').then(handleWeather);

    function handleWeather(res) {
      vm.currentWeather = JSON.parse(res.data);
    }

    function handleUpdates(res) {
      angular.forEach(res.data.updates, function(update) {
        update.content = $sce.trustAsHtml(update.content);
        if (update.link) {
          update.link = $sce.trustAsHtml(update.link);
        }
      });
      vm.updates = res.data.updates;
    }
  }
}());
