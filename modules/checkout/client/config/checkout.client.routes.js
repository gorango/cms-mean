(function () {
  'use strict';

  angular
    .module('checkout.routes')
    .config(routeConfig);

  function routeConfig($stateProvider) {
    $stateProvider
      .state('checkout', {
        url: '/checkout',
        template: '<ui-view></ui-view>',
        abstract: true
      })
      .state('checkout.confirm', {
        url: '/confirm',
        templateUrl: '/modules/checkout/client/views/checkout.confirm.client.view.html',
        controller: 'CheckoutController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Order Confirmation'
        }
      });
  }
}());
