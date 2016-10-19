(function() {
  'use strict';

  angular
    .module('info')
    .controller('InfoController', InfoController);

  InfoController.$inject = ['$http', '$sce', '$timeout'];

  function InfoController($http, $sce, $timeout) {
    var vm = this;

    vm.subscriber = {};
    vm.subscribeForm = {};
    vm.updates;
    vm.faq;
    vm.subscribe = subscribe;

    $http.get('/service-updates.json').then(handleUpdates);
    $http.get('/faq.json').then(handleFaq);
    $http.get('/api/current-weather').then(handleWeather);

    function subscribe() {
      vm.subscribeForm.$setPristine();
      vm.subscriber = {};
      vm.subscribed = true;
    }

    function handleUpdates(res) {
      angular.forEach(res.data.updates, function(update) {
        update.content = $sce.trustAsHtml(update.content);
        if (update.link) {
          update.link = $sce.trustAsHtml(update.link);
        }
      });
      vm.updates = res.data.updates.slice(res.data.updates.length - 20);
    }

    function handleFaq(res) {
      vm.faq = res.data.content;
    }

    function handleWeather(res) {
      vm.currentWeather = JSON.parse(res.data);
    }
  }
}());
