(function () {
  'use strict';

  angular
    .module('office.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('office', {
        url: '/office',
        templateUrl: '/modules/office/client/views/office.client.view.html',
        controller: 'OfficeController',
        controllerAs: 'vm',
        redirectTo: 'office.dashboard',
        data: {
          roles: ['user']
        }
      })
      .state('office.dashboard', {
        url: '',
        templateUrl: '/modules/office/client/views/office-dashboard.client.view.html',
        controller: 'OfficeDashboardController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dashboard'
        }
      })
      .state('office.routing', {
        url: '/routing',
        templateUrl: '/modules/routing/client/views/routing.client.view.html',
        controller: 'RoutingController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Routing'
        }
      })
      .state('office.updates', {
        url: '/updates',
        templateUrl: '/modules/updates/client/views/admin/manage-updates.client.view.html',
        controller: 'ManageUpdatesController',
        controllerAs: 'vm'
      });
  }
}());
