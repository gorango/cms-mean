(function () {
  'use strict';

  angular
    .module('info.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('info', {
        url: '/info',
        templateUrl: '/modules/info/client/views/info.client.view.html',
        redirectTo: 'info.updates',
        data: {
          pageTitle: 'Service'
        }
      })
      .state('info.updates', {
        url: '/updates',
        templateUrl: '/modules/info/client/views/info.updates.client.view.html',
        data: {
          pageTitle: 'Service Updates'
        }
      })
      .state('info.faq', {
        url: '/faq',
        templateUrl: '/modules/info/client/views/info.faq.client.view.html',
        data: {
          pageTitle: 'Frequently Asked Questions'
        }
      })
      .state('info.opportunities', {
        url: '/opportunities',
        templateUrl: '/modules/info/client/views/info.opportunities.client.view.html',
        data: {
          pageTitle: 'Opportunities'
        }
      })
      .state('info.about', {
        url: '/about',
        templateUrl: '/modules/info/client/views/info.about.client.view.html',
        data: {
          pageTitle: 'About Us'
        }
      });
  }

  getInfo.$inject = ['$stateParams', 'InfoService'];

  function getInfo($stateParams, InfoService) {
    return InfoService.get({
      infoId: $stateParams.infoId
    }).$promise;
  }
}());
