(function () {
  'use strict';

  angular
    .module('routing.routes')
    .config(routingConfig);

  routingConfig.$inject = ['$stateProvider'];

  function routingConfig($stateProvider) {
    $stateProvider
      .state('routing', {
        abstract: true,
        url: '/routing',
        template: '<ui-view/>'
      })
      .state('routing.view', {
        url: '/:routeId',
        templateUrl: '/modules/routing/client/views/routing.client.view.html',
        controller: 'RoutingController',
        controllerAs: 'vm',
        resolve: {
          routeResolve: getRoute
        },
        data: {
          pageTitle: 'Routing'
        }
      })
      .state('routing.list', {
        url: '/list',
        templateUrl: '/modules/routing/client/views/list-routes.client.view.html',
        controller: 'RoutesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Routes List'
        }
      });
  }

  getRoute.$inject = ['$stateParams', 'RoutingService'];

  function getRoute($stateParams, RoutingService) {
    return RoutingService.get({
      routeId: $stateParams.routeId
    }).$promise;
  }
}());
