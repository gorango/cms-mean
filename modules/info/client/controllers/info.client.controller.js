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
    vm.faq;
    vm.subscribe = subscribe;

    $http.get('/faq.json').then(handleFaq);

    function subscribe() {
      vm.subscribeForm.$setPristine();
      vm.subscriber = {};
      vm.subscribed = true;
    }

    function handleFaq(res) {
      vm.faq = res.data.content;
    }
  }
}());
