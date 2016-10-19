(function () {
  'use strict';

  angular
    .module('service.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('service', {
        url: '/service',
        templateUrl: '/modules/service/client/views/service.client.view.html',
        redirectTo: 'service.quote',
        controller: 'ServiceController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Service'
        }
      })
      .state('service.quote', {
        url: '/quote',
        templateUrl: '/modules/quote/client/views/quote.client.view.html',
        controller: 'QuoteController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Quote Calculator'
        }
      })
      .state('service.register', {
        url: '/register',
        templateUrl: '/modules/quote/client/views/register.client.view.html',
        controller: 'RegistrationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Online Registration'
        }
      })
      .state('service.area', {
        url: '/area',
        templateUrl: '/modules/service/client/views/service.area.client.view.html',
        data: {
          pageTitle: 'Service Area'
        }
      })
      .state('service.benefits', {
        url: '/benefits',
        templateUrl: '/modules/service/client/views/service.benefits.client.view.html',
        data: {
          pageTitle: 'Benefits'
        }
      })
      .state('service.process', {
        url: '/process',
        templateUrl: '/modules/service/client/views/service.process.client.view.html',
        data: {
          pageTitle: 'Process'
        }
      });
  }
}());
