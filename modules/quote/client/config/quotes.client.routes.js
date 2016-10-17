(function () {
  'use strict';

  angular
    .module('quotes.routes')
    .config(routeConfig);

  function routeConfig($stateProvider) {
    $stateProvider
      .state('quote', {
        url: '/quote',
        templateUrl: '/modules/quote/client/views/quote.client.view.html',
        controller: 'QuoteController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Receive a Free Quote'
        }
      });
  }
}());
