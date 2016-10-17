(function () {
  'use strict';

  angular
    .module('legal.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('legal', {
        url: '/legal',
        templateUrl: '/modules/legal/client/views/legal.client.view.html',
        redirectTo: 'legal.privacy',
        controller: 'LegalController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Legal'
        }
      })
      .state('legal.privacy', {
        url: '/privacy',
        templateUrl: '/modules/legal/client/views/legal.privacy.client.view.html',
        data: {
          pageTitle: 'Privacy Policy'
        }
      })
      .state('legal.terms', {
        url: '/terms',
        templateUrl: '/modules/legal/client/views/legal.terms.client.view.html',
        data: {
          pageTitle: 'Terms and Conditions'
        }
      })
      .state('legal.agreement', {
        url: '/agreement',
        templateUrl: '/modules/legal/client/views/legal.agreement.client.view.html',
        data: {
          pageTitle: 'Service Agreement'
        }
      });
  }
}());
