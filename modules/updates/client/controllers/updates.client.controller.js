(function () {
  'use strict';

  angular
    .module('updates')
    .controller('UpdatesController', UpdatesController);

  UpdatesController.$inject = ['$sce', '$http', '$mdToast', 'UpdatesService', 'SubscribersService', 'WeatherService', 'Authentication'];

  function UpdatesController($sce, $http, $mdToast, UpdatesService, SubscribersService, WeatherService, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.subscribe = subscribe;

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

    function subscribe(subscriber) {
      var sub = new SubscribersService(subscriber);
      sub.$save().then(function() {
        vm.subscribed = true;
        $mdToast.show(
          $mdToast.simple()
            .textContent('You have successfully subscribed!')
            .position('top center')
            .hideDelay(3000)
          );
      }, function(err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('You are already subscribed!')
            .position('top center')
            .hideDelay(3000)
          );
      });
    }
  }
}());
